# Bike Rental Management System

A Next.js application for managing bike rentals with Google Sheets integration.

## Features

- **Home Page (/)**: Welcome page with navigation to bike management
- **Bikes Page (/bikes)**: View all bikes with their status and information
- **Individual Bike Page (/bike/[id])**: Manage individual bike status and user assignment

## Setup

1. **Install dependencies**:

```bash
npm install
# or
pnpm install
```

2. **Configure Google Sheets API**:

   - Create a Google Cloud project
   - Enable Google Sheets API
   - Create a service account and download the JSON key
   - Rename the key file to `googleKey.json` and place it in the project root

3. **Set up environment variables**:

   - Copy `.env.local` and add your Google Sheet ID:

   ```
   GOOGLE_SHEET_ID=your_actual_google_sheet_id_here
   ```

4. **Google Sheets Structure**:
   Your Google Sheet should have two sheets:

   **"Bikes Database" sheet with columns:**

   - A: ID (number)
   - B: Status (Active/Inactive)
   - C: Brand (text)
   - D: User (text)

   **"Logs" sheet with columns:**

   - A: Date
   - B: Type (Added/Returned)
   - C: Bike Number
   - D: Brand
   - E: User

5. **Apps Script Setup**:
   - Add the provided Apps Script code to your Google Sheet
   - Run `initializeBikeRentalSystem()` function once to set up the sheets

## Running the Application

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How it Works

1. **View All Bikes**: Navigate to `/bikes` to see all bikes with their current status
2. **Manage Individual Bikes**: Click on any bike to go to its detail page
3. **Active Bikes**: Show current user and "Set Inactive" button to return the bike
4. **Inactive Bikes**: Show user input field and "Set Active" button to assign the bike
5. **Automatic Logging**: The Google Apps Script automatically logs all status changes

## API Functions

- `getAllBikes()`: Fetches all bikes from the Google Sheet, returns `SuccessResponse<Bike[]>` or `ErrorResponse`
- `getBikeById(id)`: Fetches a specific bike by ID, returns `SuccessResponse<Bike | null>` or `ErrorResponse`
- `updateBikeStatus(id, status, user)`: Updates bike status and user assignment, returns `SuccessResponse<void>` or `ErrorResponse`
- `getBikeCount()`: Gets total bike count, returns `SuccessResponse<number>` or `ErrorResponse`
- `validateGoogleSheetsConnection()`: Validates Google Sheets connection status

## Technology Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Google Sheets API** for data storage
- **Google Apps Script** for automatic logging
