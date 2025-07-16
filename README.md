# Bike Rental Management System

A modern Next.js application for managing bike rentals with real-time Google Sheets integration and beautiful UI.

## Features

- **Home Page (/)**: Welcome page with navigation to bike management
- **Bikes Page (/bikes)**: View all bikes with their status and information (dynamic, real-time data)
- **Individual Bike Page (/bike/[id])**: Manage individual bike status and user assignment
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Data is fetched fresh from Google Sheets on each request
- **Error Handling**: Graceful error handling with user-friendly messages
- **Toast Notifications**: User feedback for actions and errors
- **FontAwesome Icons**: Beautiful bicycle icons throughout the app

## Tech Stack

- **Next.js 15** with App Router and TypeScript
- **React 19** with server components
- **Tailwind CSS 4** for styling
- **Google Sheets API** for data storage
- **FontAwesome** for icons
- **React Toastify** for notifications
- **pnpm** for package management

## Setup

1. **Install dependencies**:

```bash
pnpm install
```

2. **Configure Google Sheets API**:

   ### Step 1: Create a Google Cloud Project

   1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
   2. Click on the project dropdown at the top of the page
   3. Click "New Project"
   4. Enter a project name (e.g., "bike-rental-app")
   5. Click "Create"
   6. Wait for the project to be created and select it

   ### Step 2: Enable the Google Sheets API

   1. In the Google Cloud Console, navigate to "APIs & Services" → "Library"
   2. Search for "Google Sheets API"
   3. Click on "Google Sheets API" from the results
   4. Click "Enable"
   5. Wait for the API to be enabled

   ### Step 3: Create Service Account Credentials

   1. Go to "APIs & Services" → "Credentials"
   2. Click "Create Credentials" → "Service Account"
   3. Fill in the service account details:
      - **Service account name**: `bike-rental-service`
      - **Service account ID**: Will be auto-generated
      - **Description**: `Service account for bike rental app`
   4. Click "Create and Continue"
   5. Skip the optional role assignment (click "Continue")
   6. Skip granting user access (click "Done")

   ### Step 4: Generate and Download the JSON Key

   1. Find your newly created service account in the credentials list
   2. Click on the service account email
   3. Go to the "Keys" tab
   4. Click "Add Key" → "Create New Key"
   5. Select "JSON" as the key type
   6. Click "Create"
   7. The JSON key file will be downloaded automatically
   8. **Important**: Rename this file to `googleKey.json` and place it in your project root directory

   ### Step 5: Share Your Google Sheet with the Service Account

   1. Open your Google Sheet
   2. Click the "Share" button
   3. In the service account JSON file, find the `client_email` field
   4. Copy the email address (it looks like: `bike-rental-service@your-project.iam.gserviceaccount.com`)
   5. Paste this email in the "Share with people and groups" field
   6. Set permissions to "Editor"
   7. **Uncheck** "Notify people" (since it's a service account)
   8. Click "Share"

   ### Step 6: Get Your Google Sheet ID

   1. Open your Google Sheet
   2. Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0`
   3. Copy the `SHEET_ID` portion (the long string between `/d/` and `/edit`)
   4. You'll need this for the environment variables

   ### Security Note

   - **Never commit** the `googleKey.json` file to version control
   - The file is already included in `.gitignore`
   - Keep this file secure as it provides access to your Google Cloud project

3. **Set up environment variables**:

   Create a `.env` file in your project root and add your Google Sheet ID:

   ```bash
   GOOGLE_SHEET_ID=your_actual_google_sheet_id_here
   ```

   **How to find your Google Sheet ID:**

   - Open your Google Sheet
   - Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0`
   - Copy the `SHEET_ID` portion (the long string between `/d/` and `/edit`)
   - Paste it as the value for `GOOGLE_SHEET_ID`

   **Example:**

   ```bash
   GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

   **Note:** The `.env` file is automatically ignored by Git for security.

## Quick Start Guide

### Testing Your Setup

After completing the setup steps above, you can verify everything is working:

1. **Start the development server:**

   ```bash
   pnpm dev
   ```

2. **Open your browser** and go to [http://localhost:3000](http://localhost:3000)

3. **Test the connection:**

   - If you see the home page, the basic setup is working
   - Navigate to `/bikes` to test the Google Sheets connection
   - If you see your bike data, everything is configured correctly!

4. **If you get errors:**
   - Check the browser console (F12) for client-side errors
   - Check the terminal for server-side errors
   - Refer to the [Troubleshooting](#troubleshooting-setup) section below

### Sample Data for Testing

You can use this sample data to test your Google Sheets setup:

**Bikes Database sheet:**

```
ID | Status   | Brand       | User
1  | Active   | Trek        | John Doe
2  | Inactive | Giant       |
3  | Active   | Specialized | Jane Smith
4  | Inactive | Cannondale  |
```

**Logs sheet:** (This will be populated automatically when you use the app)

```
Date      | Type     | Bike Number | Brand       | User
15 Jul 25 | Added    | 1          | Trek        | John Doe
15 Jul 25 | Returned | 2          | Giant       | Jane Smith
```

## Troubleshooting Setup

### Common Issues and Solutions

#### 1. "Failed to initialize Google Sheets client" Error

**Problem:** The app cannot connect to Google Sheets.

**Solutions:**

- Check that `googleKey.json` exists in your project root
- Verify the JSON file is valid (not corrupted during download)
- Ensure the service account email has been shared with your Google Sheet
- Check that the Google Sheets API is enabled in your Google Cloud project

#### 2. "Permission denied" or "Forbidden" Error

**Problem:** The service account doesn't have access to your Google Sheet.

**Solutions:**

- Open your Google Sheet and click "Share"
- Add the service account email (from `client_email` in `googleKey.json`)
- Set permissions to "Editor"
- Make sure you unchecked "Notify people" when sharing

#### 3. "Sheet not found" Error

**Problem:** The app cannot find the specified sheets.

**Solutions:**

- Ensure your Google Sheet has exactly two sheets named:
  - "Bikes Database"
  - "Logs"
- Check for typos in sheet names (case-sensitive)
- Verify your `GOOGLE_SHEET_ID` in `.env` is correct

#### 4. Environment Variables Not Working

**Problem:** The app says it can't find environment variables.

**Solutions:**

- Ensure the file is named `.env`
- Check that the file is in your project root directory
- Restart your development server after creating/modifying `.env`
- Verify there are no extra spaces around the `=` sign

#### 5. "Invalid credentials" Error

**Problem:** The service account credentials are invalid.

**Solutions:**

- Re-download the JSON key from Google Cloud Console
- Ensure you selected "JSON" when creating the key
- Check that the file wasn't corrupted during download
- Verify you're using the correct Google Cloud project

### Getting Help

If you're still having issues:

1. Check the browser console for detailed error messages
2. Review the terminal output for server-side errors
3. Ensure all steps in the setup guide were followed exactly
4. Try creating a new service account if problems persist

## Running the Application

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Other Commands

```bash
# Run linting
pnpm lint

# Development with turbopack (faster)
pnpm dev --turbopack
```

## Project Structure

```
src/
├── actions/
│   └── google.ts          # Server actions for Google Sheets integration
├── app/
│   ├── (main)/           # Route group for main app pages
│   │   ├── layout.tsx    # Layout with dynamic back navigation
│   │   ├── bikes/
│   │   │   └── page.tsx  # Bikes listing page (dynamic)
│   │   └── bike/
│   │       └── [id]/
│   │           ├── page.tsx     # Individual bike page
│   │           └── not-found.tsx # Bike not found page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── not-found.tsx     # 404 page
│   └── global-error.tsx  # Global error boundary
├── components/
│   ├── BikeForm.tsx      # Form for updating bike status
│   └── SubmitButton.tsx  # Submit button component
├── types/
│   ├── bike.ts           # Bike type definitions
│   └── response.ts       # API response type definitions
└── utils/
    └── google.ts         # Google Sheets utility functions
```

## How It Works

### Navigation Flow

1. **Home** (`/`) → **Bikes List** (`/bikes`) → **Individual Bike** (`/bike/[id]`)
2. **Dynamic Back Navigation**:
   - From `/bikes` → "Back to Home"
   - From `/bike/[id]` → "Back to Bikes"

### Bike Management

1. **View All Bikes**: Navigate to `/bikes` to see all bikes with real-time status
2. **Manage Individual Bikes**: Click on any bike to go to its detail page
3. **Active Bikes**: Shows current user and "Set Inactive" button to return the bike
4. **Inactive Bikes**: Shows user input field and "Set Active" button to assign the bike
5. **Real-time Updates**: All changes are immediately reflected in Google Sheets
6. **Automatic Logging**: All status changes are automatically logged to the "Logs" sheet with:
   - Formatted date (DD MMM YY format)
   - Action type (Added/Returned)
   - Bike details (ID, brand)
   - User information

### Error Handling

- **Global Error Boundary**: `global-error.tsx` catches unhandled errors application-wide
- **Graceful Error Pages**: Custom 404 pages for missing bikes and general errors
- **API Error Handling**: All API functions return structured success/error responses
- **User-Friendly Messages**: Clear error messages displayed to users
- **Retry Logic**: Built-in exponential backoff retry mechanism for Google Sheets API calls
- **Error Logging**: All errors are logged to console with detailed information

### Logging System

- **Automatic Logging**: All bike status changes are automatically logged to the "Logs" sheet
- **Comprehensive Data**: Each log entry includes date, action type, bike ID, brand, and user
- **Date Formatting**: Uses human-readable format (e.g., "16 Jul 25")
- **User Attribution**:
  - "Added" entries show who took the bike
  - "Returned" entries show who returned the bike

## API Functions

All API functions are server actions that return structured responses:

### Core Functions

- **`getAllBikes()`**: Fetches all bikes from Google Sheets

  - Returns: `SuccessResponse<Bike[]>` or `ErrorResponse`
  - Features: Real-time data, error handling, data validation, retry logic

- **`getBikeById(id: number)`**: Fetches a specific bike by ID

  - Returns: `SuccessResponse<Bike>` or `ErrorResponse`
  - Features: Input validation, not found handling, retry logic

- **`updateBikeStatus(formData: FormData)`**: Updates bike status and user assignment
  - Returns: `SuccessResponse<void>` or `ErrorResponse`
  - Features: Form data handling, automatic path revalidation, business logic, logging
  - Handles: Status toggling, user assignment/removal, validation
  - Logging: Automatically logs all status changes to "Logs" sheet (Added/Returned)
  - Validation: Requires User field when activating bikes, clears User field when deactivating

### Utility Functions

- **`getBikeCount()`**: Gets total bike count

  - Returns: `SuccessResponse<number>` or `ErrorResponse`

- **`validateGoogleSheetsConnection()`**: Validates Google Sheets connection
  - Returns: Connection status and sheet information

### Helper Functions

- **`getGoogleSheetsClient()`**: Creates and manages Google Sheets API client

  - Features: Singleton pattern, credential management, error handling

- **`retryOperation<T>()`**: Implements retry logic for API operations

  - Features: Exponential backoff, configurable retries, error logging

- **`addLog()`**: Handles logging of bike status changes
  - Features: Date formatting, conditional user assignment, Google Sheets integration
  - Formatting: Applies cell colors and borders based on action type

### Response Types

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  error: null;
}

interface ErrorResponse {
  success: false;
  data: null;
  error: Error;
}

interface Bike {
  id: number;
  status: "Active" | "Inactive";
  brand: string;
  user: string;
}
```

## Key Features

### Real-time Data

- **Dynamic Pages**: `/bikes` page uses `export const dynamic = 'force-dynamic'` for fresh data
- **Automatic Revalidation**: Updates trigger revalidation of affected pages
- **No Stale Data**: Every request fetches current data from Google Sheets

### Error Handling

- **Multi-Level Error Boundaries**: Global error boundary for app-wide errors, component-level boundaries for granular handling
- **No Thrown Errors**: All functions return structured responses instead of throwing
- **Graceful Degradation**: UI handles errors gracefully with user-friendly messages
- **Retry Logic**: Built-in exponential backoff retry mechanism for Google Sheets API calls
- **Comprehensive Logging**: Failed operations are logged with detailed error messages
- **Error Recovery**: Reset functionality allows users to recover from error states

### Logging & Analytics

- **Automatic Activity Logging**: All bike status changes are automatically tracked
- **Visual Log Formatting**: Color-coded entries with borders for easy reading
- **Historical Data**: Complete audit trail of all bike transactions
- **User Attribution**: Clear tracking of who performed each action
- **Date Formatting**: Human-readable date format for better usability

### User Experience

- **Responsive Design**: Works on all device sizes
- **Loading States**: Proper loading and error states
- **Intuitive Navigation**: Clear breadcrumb-style navigation
- **Visual Feedback**: Status indicators and hover effects

## Deployment

This is a standard Next.js application that can be deployed to:

- **Vercel** (recommended)
- **Netlify**
- **AWS**
- **Any Node.js hosting platform**

### Environment Variables for Production

Make sure to set these in your deployment environment:

```
GOOGLE_SHEET_ID=your_actual_google_sheet_id_here
```

### Build Optimization

- **Static Home Page**: Home page is statically generated for fast loading
- **Dynamic Data Pages**: Bike pages are dynamically rendered for real-time data
- **Turbopack**: Development uses Turbopack for faster builds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
