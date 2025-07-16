"use server";

import { google, sheets_v4 } from "googleapis";

import { getGoogleKeys } from "@/utils/google";
import { ErrorResponse, SuccessResponse } from "@/types/response";
import { Bike } from "@/types/bike";

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
        .map((row, index) => {
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
  id: number,
  status: "Active" | "Inactive",
  user: string = ""
): Promise<SuccessResponse<void> | ErrorResponse> {
  try {
    if (!id || isNaN(id) || id <= 0)
      return {
        success: false,
        data: null,
        error: new Error("Invalid bike ID. ID must be a positive number."),
      };

    if (status !== "Active" && status !== "Inactive")
      return {
        success: false,
        data: null,
        error: new Error(
          'Invalid status. Status must be "Active" or "Inactive".'
        ),
      };

    if (user && typeof user !== "string")
      return {
        success: false,
        data: null,
        error: new Error("User must be a string."),
      };

    const result = await retryOperation(async () => {
      const glSheets = await getGoogleSheetsClient();

      if (!glSheets) {
        return null;
      }

      const bikesResponse = await getAllBikes();

      if (!bikesResponse.success) {
        throw bikesResponse.error;
      }

      const bikes = bikesResponse.data;
      const bikeIndex = bikes.findIndex((bike) => bike.id === id);

      if (bikeIndex === -1) {
        throw new Error(`Bike with ID ${id} not found`);
      }

      const bike = bikes[bikeIndex];
      const rowNumber = bikeIndex + 2; // +2 because sheets are 1-indexed and we skip the header

      const updateResult = await glSheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `Bikes Database!B${rowNumber}:D${rowNumber}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[status, bike.brand, user]],
        },
      });

      if (!updateResult.data || !updateResult.data.updatedCells) {
        throw new Error("Failed to update bike status - no cells were updated");
      }

      console.log(
        `Successfully updated bike ${id} status to ${status}${
          user ? ` for user ${user}` : ""
        }`
      );
    });

    if (result === null)
      return {
        success: false,
        data: null,
        error: new Error("Failed to update bike status"),
      };

    return {
      success: true,
      data: undefined,
      error: null,
    };
  } catch (error) {
    console.error(`Error updating bike status for ID ${id}:`, error);
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
