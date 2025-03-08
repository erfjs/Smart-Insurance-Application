# Smart-Insurance-Application-Portal


This project is a React.js web application designed for a Smart Insurance Application Portal. The application allows users to apply for different types of insurance through dynamic forms fetched from an API. It also provides a customizable list view to display submitted insurance applications with sorting, searching, pagination, and column selection features.

## Features
- **Dynamic Forms**: Forms are fetched from an API and rendered dynamically based on the structure and logic defined in the backend. Fields are conditionally shown or hidden based on user input.
- **Customizable List View**: Users can view submitted insurance applications with the ability to filter, sort, and select columns. The data is displayed in a table format with pagination.
- **Validation**: The form data is validated before submission.
- **API Integration**: The app interacts with the backend to fetch form data, submit applications, and retrieve submitted applications.

## API Endpoints

### Fetch Dynamic Form
**GET** `/api/insurance/forms`  
Fetches the dynamic form structure.

### Submit Form Data
**POST** `/api/insurance/forms/submit`  
Submits the filled form data to the backend.

### Fetch Submitted Applications
**GET** `/api/insurance/forms/submissions`  
Fetches the list of submitted applications.


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
   


API Usage Details
Fetching the Dynamic Form
The form structure is fetched from the endpoint /api/insurance/forms. The response contains the structure of the form, including all the fields, conditional logic, and any nested sections.

Submitting the Form
Once the form is filled out, it can be submitted using a POST request to /api/insurance/forms/submit. The request body should include the filled form data.

Fetching Submitted Applications
You can retrieve all the submitted applications using a GET request to /api/insurance/forms/submissions. The response will contain a list of applications, which can be displayed in a table format with customizable columns.

Features Implemented
Dynamic form rendering with conditional fields based on user input.
Customizable list view for displaying submitted applications with sorting, filtering, and pagination.
Column selector chooses which columns to display in the list view.
Responsive design to ensure usability across different devices.
API integration to fetch form data, submit applications, and fetch submitted applications.
Assumptions Made
The backend API endpoints are functional and provide the necessary data (form structure, submitted applications).
Form validation is performed based on the conditions outlined in the API response.
The data from the backend is well-structured and contains the necessary fields.
Bonus Features Implemented
Autosave drafts before form submission.
Dark Mode toggle for improved user experience.
Localization support for multi-language support.
Deployment
This application is deployed on (Netlify). You can access the live demo here:
Live Demo

Technologies Used
React.js (Functional Components, Hooks)
Axios for API calls
Material UI for UI components
i18next for multi-language
react-beautiful-dnd for drag and drop

