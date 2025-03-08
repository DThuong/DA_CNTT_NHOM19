# E-commerce Project

## Project Structure

The project is divided into two main parts: the front end and the back end. Below is the detailed structure:

### Front End

Located in the `client` directory, the front end is built using React and Redux.

- **client/**
  - **.env**: Environment variables for the front end.
  - **.gitignore**: Git ignore file.
  - **build/**: Contains the production build files.
  - **public/**: Contains static files like `index.html`, `favicon.ico`, etc.
  - **src/**: Contains the source code for the front end.
    - **apis/**: API service files for making HTTP requests.
    - **assets/**: Static assets like images and styles.
    - **components/**: Reusable React components.
    - **pages/**: React components for different pages of the application.
      - **member/**: Pages related to member functionalities.
      - **admin/**: Pages related to admin functionalities.
      - **public/**: Pages accessible to the public.
    - **store/**: Redux store configuration and slices.
    - **utils/**: Utility functions and constants.
    - **App.js**: The main application component.
    - **tailwind.config.js**: Configuration file for Tailwind CSS.
  - **package.json**: Project dependencies and scripts.
  - **README.md**: Documentation for the front end.

### Back End

Located in the `server` directory, the back end is built using Node.js and Express.

- **server/**
  - **.env**: Environment variables for the back end.
  - **.gitignore**: Git ignore file.
  - **config/**: Configuration files.
  - **controllers/**: Controller files that handle business logic.
  - **middlewares/**: Middleware functions.
  - **models/**: Mongoose models for MongoDB collections.
  - **routes/**: Route definitions.
  - **utils/**: Utility functions.
  - **server.js**: The main server file that initializes the Express application.
  - **package.json**: Project dependencies and scripts.

### Data

Located in the `data` directory, it contains data files used in the project.

- **data/**
  - **cate_brand.js**: Category and brand data.
  - **data.json**: Sample data in JSON format.


## Getting Started

### Front End

1. Navigate to the `client` directory. Type "cd client"
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Back End

1. Navigate to the `server` directory. Type "cd server"
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## Available Scripts

### Front End

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.
- `npm run eject`: Ejects the app configuration.

### Back End

- `npm run dev`: Starts the server in development mode.
- `npm start`: Starts the server in production mode.