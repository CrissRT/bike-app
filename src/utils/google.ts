"use server";

import path from "path";
import fs from "fs";

let keys: Record<string, string>;

export async function getGoogleKeys() {
  if (keys) return keys;

  try {
    const keyfile = path.join(process.cwd(), "googleKey.json");

    if (!fs.existsSync(keyfile))
      throw new Error(
        "Google credentials file not found. Please ensure googleKey.json exists in the project root."
      );

    const keyData = fs.readFileSync(keyfile, "utf-8");
    keys = JSON.parse(keyData);

    if (!keys.client_email || !keys.private_key)
      throw new Error(
        "Invalid Google credentials format. Please check your googleKey.json file."
      );

    return keys;
  } catch (error) {
    console.error("Error loading Google credentials:", error);
    throw new Error(
      `Failed to load Google credentials: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
