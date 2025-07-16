"use server";

import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { Bike } from "@/types/bike";

const keyfile = path.join(process.cwd(), "googleKey.json");
const keys = JSON.parse(fs.readFileSync(keyfile, "utf-8"));

async function getGoogleSheetsClient() {
  const glAuth = await google.auth.getClient({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth: glAuth });
}

export async function getAllBikes(): Promise<Bike[]> {
  const glSheets = await getGoogleSheetsClient();

  const data = await glSheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Bikes Database!A2:D",
  });

  const rows = data.data.values || [];
  return rows.map((row) => ({
    id: parseInt(row[0]),
    status: row[1] as "Active" | "Inactive",
    brand: row[2],
    user: row[3] || "",
  }));
}

export async function getBikeById(id: number): Promise<Bike | null> {
  const bikes = await getAllBikes();
  return bikes.find((bike) => bike.id === id) || null;
}

export async function updateBikeStatus(
  id: number,
  status: "Active" | "Inactive",
  user: string = ""
): Promise<void> {
  const glSheets = await getGoogleSheetsClient();
  const bikes = await getAllBikes();
  const bikeIndex = bikes.findIndex((bike) => bike.id === id);

  if (bikeIndex === -1) throw new Error("Bike not found");

  const bike = bikes[bikeIndex];
  const rowNumber = bikeIndex + 2; // +2 because sheets are 1-indexed and we skip the header

  await glSheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `Bikes Database!B${rowNumber}:D${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[status, bike.brand, user]],
    },
  });
}
