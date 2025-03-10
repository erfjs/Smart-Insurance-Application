# Smart Insurance Application Portal

This is a React.js based web application developed as part of the **Frontend Developer Code Assignment** for the Smart Insurance Application Portal. The application allows users to apply for various insurance types (Health, Home, Car, etc.) through dynamic forms fetched from an API, submit applications, and view them in a customizable list view with sorting, filtering, and column selection features.

Live Demo: [Deployed on Netlify](https://smart-insurance-application-portal.netlify.app/) 

## Features

### Core Features
- **Dynamic Forms**: Form structures are fetched from the API (`GET /api/insurance/forms`) and rendered dynamically without hardcoding.
- **Conditional Logic**: Fields appear/disappear based on user input (e.g., "Security System Type" only shows if "Do you have a security system?" is "Yes").
- **Nested Fields**: Supports nested sections like Address and Vehicle Details.
- **Dynamic Options**: Some fields fetch options dynamically from the API (e.g., states based on country).
- **Form Validation**: Client-side validation ensures required fields are filled and meet specific criteria before submission.
- **Customizable List View**: Users can view submitted applications (`GET /api/insurance/forms/submissions`) in a table with:
  - **Column Selection**: Choose which columns to display (saved in `localStorage`).
  - **Sorting**: Sort columns in ascending/descending order.
  - **Filtering**: Search across all fields.
  - **Pagination**: Paginate the results with configurable rows per page.
- **API Integration**: Handles form submission (`POST /api/insurance/forms/submit`) and data retrieval efficiently.

### Bonus Features
- **Autosave Drafts**: Form data is autosaved in `localStorage` in real-time and loaded when switching between forms.
- **Dark Mode Toggle**: A theme toggle button switches between light and dark modes using a custom `ThemeContext`.
- **Localization Support**: Multi-language support (English and Persian) with `react-i18next`.
- **Drag-and-Drop**: Fields in the form can be reordered using `react-beautiful-dnd`.

## Tech Stack
- **Frontend**: React.js (with Hooks), TypeScript
- **UI Library**: Material-UI (`@mui/material`)
- **Form Management**: `react-hook-form`
- **API Requests**: Axios
- **Localization**: `react-i18next`
- **Drag-and-Drop**: `react-beautiful-dnd`
- **Styling**: CSS-in-JS via Material-UI's `sx` prop
- **Deployment**: Netlify 

## **Getting Started**

Install all dependencies using the following command:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   
