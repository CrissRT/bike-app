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

   - Create a Google Cloud project
   - Enable Google Sheets API
   - Create a service account and download the JSON key
   - Rename the key file to `googleKey.json` and place it in the project root

3. **Set up environment variables**:

   Create a `.env.local` file and add your Google Sheet ID:

   ```
   GOOGLE_SHEET_ID=your_actual_google_sheet_id_here
   ```

4. **Google Sheets Structure**:
   Your Google Sheet should have two sheets:

   **"Bikes Database" sheet with columns:**

   - **A**: ID (number) - Unique bike identifier
   - **B**: Status (Active/Inactive) - Current bike status
   - **C**: Brand (text) - Bike brand/model
   - **D**: User (text) - Current user (empty for inactive bikes)

   **"Logs" sheet with columns:**

   - **A**: Date (DD MMM YY format) - Date of status change
   - **B**: Type (Added/Returned) - Type of action
   - **C**: Bike Number (number) - Bike ID
   - **D**: Brand (text) - Bike brand
   - **E**: User (text) - User involved in the action

   Example Bikes Database data:

   ```
   1  | Active   | Trek    | John Doe
   2  | Inactive | Giant   |
   3  | Active   | Specialized | Jane Smith
   ```

   Example Logs data:

   ```
   15 Jul 25 | Added    | 1 | Trek    | John Doe
   15 Jul 25 | Returned | 2 | Giant   | Jane Smith
   16 Jul 25 | Added    | 3 | Specialized | Mike Johnson
   ```

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
│   └── not-found.tsx     # 404 page
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

### Error Handling

- **Graceful Error Pages**: Custom 404 pages for missing bikes and general errors
- **API Error Handling**: All API functions return structured success/error responses
- **User-Friendly Messages**: Clear error messages displayed to users

## API Functions

All API functions are server actions that return structured responses:

### Core Functions

- **`getAllBikes()`**: Fetches all bikes from Google Sheets

  - Returns: `SuccessResponse<Bike[]>` or `ErrorResponse`
  - Features: Real-time data, error handling, data validation

- **`getBikeById(id: number)`**: Fetches a specific bike by ID

  - Returns: `SuccessResponse<Bike>` or `ErrorResponse`
  - Features: Input validation, not found handling

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

- **No Thrown Errors**: All functions return structured responses instead of throwing
- **Graceful Degradation**: UI handles errors gracefully with user-friendly messages
- **Retry Logic**: Built-in retry mechanism for Google Sheets API calls

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
