"use server";

import { google, sheets_v4 } from "googleapis";

import {
  BikeNotFoundError,
  GoogleSheetsError,
  ValidationError,
} from "@/types/error";
import { getGoogleKeys } from "@/utils/google";

let googleSheets: sheets_v4.Sheets;

async function getGoogleSheetsClient() {
  try {
    if (googleSheets) return googleSheets;

    if (!process.env.GOOGLE_SHEET_ID)
      throw new Error("GOOGLE_SHEET_ID environment variable is required");

    const credentials = await getGoogleKeys();

    const glAuth = await google.auth.getClient({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    googleSheets = google.sheets({ version: "v4", auth: glAuth });

    return googleSheets;
  } catch (error) {
    console.error("Error creating Google Sheets client:", error);
    throw new GoogleSheetsError(
      `Failed to initialize Google Sheets client: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      error instanceof Error ? error : undefined
    );
  }
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
) {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) throw lastError;

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(
        `Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`,
        lastError.message
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

export async function getAllBikes() {
  try {
    return await retryOperation(async () => {
      const glSheets = await getGoogleSheetsClient();

      const data = await glSheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Bikes Database!A2:D",
      });

      const rows = data.data.values || [];

      if (!Array.isArray(rows))
        throw new GoogleSheetsError(
          "Invalid data format received from Google Sheets"
        );

      return rows.map((row, index) => {
        try {
          const id = parseInt(row[0]);
          if (isNaN(id)) {
            throw new ValidationError(
              `Invalid ID format in row ${index + 2}: ${row[0]}`
            );
          }

          const status = row[1] as "Active" | "Inactive";
          if (status !== "Active" && status !== "Inactive") {
            throw new ValidationError(
              `Invalid status in row ${
                index + 2
              }: ${status}. Must be "Active" or "Inactive"`
            );
          }

          return {
            id,
            status,
            brand: row[2] || "",
            user: row[3] || "",
          };
        } catch (error) {
          console.error(`Error processing row ${index + 2}:`, error);
          throw new GoogleSheetsError(
            `Failed to process bike data in row ${index + 2}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      });
    });
  } catch (error) {
    console.error("Error fetching bikes from Google Sheets:", error);
    throw new GoogleSheetsError(
      `Failed to fetch bikes: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getBikeById(id: number) {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new ValidationError(
        "Invalid bike ID. ID must be a positive number."
      );
    }

    const bikes = await getAllBikes();
    return bikes.find((bike) => bike.id === id) || null;
  } catch (error) {
    console.error(`Error fetching bike with ID ${id}:`, error);

    if (error instanceof ValidationError || error instanceof GoogleSheetsError)
      throw error;

    throw new GoogleSheetsError(
      `Failed to fetch bike: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function updateBikeStatus(
  id: number,
  status: "Active" | "Inactive",
  user: string = ""
): Promise<void> {
  try {
    // Input validation
    if (!id || isNaN(id) || id <= 0) {
      throw new ValidationError(
        "Invalid bike ID. ID must be a positive number."
      );
    }

    if (status !== "Active" && status !== "Inactive") {
      throw new ValidationError(
        'Invalid status. Status must be "Active" or "Inactive".'
      );
    }

    if (user && typeof user !== "string") {
      throw new ValidationError("User must be a string.");
    }

    await retryOperation(async () => {
      const glSheets = await getGoogleSheetsClient();
      const bikes = await getAllBikes();
      const bikeIndex = bikes.findIndex((bike) => bike.id === id);

      if (bikeIndex === -1) throw new BikeNotFoundError(id);

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
        throw new GoogleSheetsError(
          "Failed to update bike status - no cells were updated"
        );
      }

      console.log(
        `Successfully updated bike ${id} status to ${status}${
          user ? ` for user ${user}` : ""
        }`
      );
    });
  } catch (error) {
    console.error(`Error updating bike status for ID ${id}:`, error);

    if (
      error instanceof ValidationError ||
      error instanceof BikeNotFoundError ||
      error instanceof GoogleSheetsError
    )
      throw error;

    throw new GoogleSheetsError(
      `Failed to update bike status: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Health check function to validate Google Sheets connection
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

// Function to safely get bike count without fetching all data
export async function getBikeCount(): Promise<number> {
  try {
    const glSheets = await getGoogleSheetsClient();

    const data = await glSheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Bikes Database!A:A",
    });

    const rows = data.data.values || [];
    // Subtract 1 for the header row
    return Math.max(0, rows.length - 1);
  } catch (error) {
    console.error("Error getting bike count:", error);
    throw new GoogleSheetsError(
      `Failed to get bike count: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
