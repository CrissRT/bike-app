"use server";

import { google, sheets_v4 } from "googleapis";

import { getGoogleKeys } from "@/utils/google";
import { ErrorResponse, SuccessResponse } from "@/types/response";
import { Bike } from "@/types/bike";
import { revalidatePath } from "next/cache";

let googleSheets: sheets_v4.Sheets;

async function getGoogleSheetsClient(): Promise<sheets_v4.Sheets | null> {
  try {
    if (googleSheets) return googleSheets;

    if (!process.env.GOOGLE_SHEET_ID) {
      console.error("GOOGLE_SHEET_ID environment variable is required");
      return null;
    }

    const credentials = await getGoogleKeys();

    const glAuth = await google.auth.getClient({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    googleSheets = google.sheets({ version: "v4", auth: glAuth });

    return googleSheets;
  } catch (error) {
    console.error("Error creating Google Sheets client:", error);
    return null;
  }
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T | null> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        console.error(
          `Operation failed after ${maxRetries} attempts:`,
          lastError.message
        );
        return null;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(
        `Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`,
        lastError.message
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return null;
}

export async function getAllBikes(): Promise<
  SuccessResponse<Bike[]> | ErrorResponse
> {
  try {
    const data = await retryOperation(async () => {
      const glSheets = await getGoogleSheetsClient();

      if (!glSheets) return null;

      const data = await glSheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Bikes Database!A2:D",
      });

      const rows = data.data.values || [];

      if (!Array.isArray(rows)) return null;

      return rows
        .map((row) => {
          const id = Number(row[0]);
          if (isNaN(id)) return null;

          const status = row[1] as "Active" | "Inactive";
          if (status !== "Active" && status !== "Inactive") return null;

          return {
            id,
            status,
            brand: row[2] || "",
            user: row[3] || "",
          };
        })
        .filter((bike): bike is Bike => bike !== null);
    });

    if (data === null) {
      return {
        success: false,
        data: null,
        error: new Error("Failed to fetch bikes from Google Sheets"),
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching bikes from Google Sheets:", error);
    return {
      success: false,
      data: null,
      error: new Error(
        `Failed to fetch bikes: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      ),
    };
  }
}

export async function getBikeById(
  id: number
): Promise<SuccessResponse<Bike> | ErrorResponse> {
  try {
    if (!id || isNaN(id) || id <= 0)
      return {
        success: false,
        data: null,
        error: new Error("Invalid bike ID. ID must be a positive number."),
      };

    const bikesResponse = await getAllBikes();

    if (!bikesResponse.success)
      return {
        success: false,
        data: null,
        error: bikesResponse.error,
      };

    const bike = bikesResponse.data.find((bike) => bike.id === id);

    if (!bike)
      return {
        success: false,
        data: null,
        error: new Error(`Bike with ID ${id} not found`),
      };

    return {
      success: true,
      data: bike,
      error: null,
    };
  } catch (error) {
    console.error(`Error fetching bike with ID ${id}:`, error);
    return {
      success: false,
      data: null,
      error: new Error(
        `Failed to fetch bike: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      ),
    };
  }
}

export async function updateBikeStatus(
  formData: FormData
): Promise<SuccessResponse<void> | ErrorResponse> {
  try {
    const bikeId = Number(formData.get("bikeId"));
    const currentStatus = String(formData.get("currentStatus"));
    const userName = String(formData.get("userName"));

    if (!bikeId || isNaN(bikeId) || bikeId <= 0)
      return {
        success: false,
        data: null,
        error: new Error("Invalid bike ID. ID must be a positive number."),
      };

    let newStatus: "Active" | "Inactive";
    let newUser: string;
    let logType: "Added" | "Returned";

    if (currentStatus === "Active") {
      newStatus = "Inactive";
      newUser = "";
      logType = "Returned";
    } else {
      const trimmedUserName = userName.trim();
      if (!trimmedUserName)
        return {
          success: false,
          data: null,
          error: new Error("Add User First"),
        };

      newStatus = "Active";
      newUser = trimmedUserName;
      logType = "Added";
    }

    const result = await retryOperation(async () => {
      const glSheets = await getGoogleSheetsClient();

      if (!glSheets) return null;

      const bikesResponse = await getAllBikes();

      if (!bikesResponse.success) return null;

      const bikes = bikesResponse.data;
      const bikeIndex = bikes.findIndex((bike) => bike.id === bikeId);

      if (bikeIndex === -1) return null;

      const bike = bikes[bikeIndex];
      const rowNumber = bikeIndex + 2; // +2 because sheets are 1-indexed and we skip the header

      const updateResult = await glSheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `Bikes Database!B${rowNumber}:D${rowNumber}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[newStatus, bike.brand, newUser]],
        },
      });

      if (!updateResult.data || !updateResult.data.updatedCells) return null;

      await addLog(logType, bikeId, bike, newUser);

      return true;
    });

    if (result === null)
      return {
        success: false,
        data: null,
        error: new Error("Failed to update bike status"),
      };

    revalidatePath(`/bike/${bikeId}`);
    revalidatePath("/bikes");

    return {
      success: true,
      data: undefined,
      error: null,
    };
  } catch (error) {
    console.error("Error updating bike status:", error);
    return {
      success: false,
      data: null,
      error: new Error(
        `Failed to update bike status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      ),
    };
  }
}

export async function validateGoogleSheetsConnection(): Promise<{
  isConnected: boolean;
  error?: string;
  sheetInfo?: {
    title: string;
    sheetCount: number;
  };
}> {
  try {
    const glSheets = await getGoogleSheetsClient();

    if (!glSheets)
      return {
        isConnected: false,
        error: "Failed to initialize Google Sheets client",
      };

    const spreadsheetInfo = await glSheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    return {
      isConnected: true,
      sheetInfo: {
        title: spreadsheetInfo.data.properties?.title || "Unknown",
        sheetCount: spreadsheetInfo.data.sheets?.length || 0,
      },
    };
  } catch (error) {
    console.error("Google Sheets connection validation failed:", error);
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getBikeCount(): Promise<
  SuccessResponse<number> | ErrorResponse
> {
  try {
    const glSheets = await getGoogleSheetsClient();

    if (!glSheets)
      return {
        success: false,
        data: null,
        error: new Error("Failed to initialize Google Sheets client"),
      };

    const data = await glSheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Bikes Database!A:A",
    });

    const rows = data.data.values || [];

    const count = Math.max(0, rows.length - 1);

    return {
      success: true,
      data: count,
      error: null,
    };
  } catch (error) {
    console.error("Error getting bike count:", error);
    return {
      success: false,
      data: null,
      error: new Error(
        `Failed to get bike count: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      ),
    };
  }
}

async function addLog(
  logType: "Added" | "Returned",
  bikeId: number,
  bike: Bike,
  newUser: string
) {
  const glSheets = await getGoogleSheetsClient();

  if (!glSheets) return null;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("en-US", { month: "short" });
  const year = currentDate.getFullYear().toString().slice(-2);
  const formattedDate = `${day} ${month} ${year}`;

  const logEntry = [
    formattedDate,
    logType,
    bikeId,
    bike.brand,
    logType === "Added" ? newUser : bike.user || "",
  ];

  try {
    await glSheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Logs!A:E",
      valueInputOption: "RAW",
      requestBody: {
        values: [logEntry],
      },
    });
  } catch (logError) {
    console.warn("Failed to add log entry:", logError);
  }
}
