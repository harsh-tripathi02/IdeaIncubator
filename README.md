# IdeaIncubator

IdeaIncubator is a platform designed to help users brainstorm, share, and manage their ideas. It provides a user-friendly interface for creating, editing, and organizing ideas, along with authentication and theming support.

## Project Structure

The project is divided into two main parts: the client and the server.

### Client
The client is a React-based frontend application located in the `client/` directory. It includes the following key components:

- **`public/`**: Contains static files like `index.html`, `manifest.json`, and `robots.txt`.
- **`src/`**: Contains the main source code for the React application, including:
  - **`components/`**: Reusable UI components such as `Navbar`, `ErrorBoundary`, and forms.
  - **`context/`**: Context files for managing global state, such as `AuthContext` and `ThemeContext`.
  - **`contexts/`**: (Duplicate folder, possibly redundant).
  - **`App.js`**: The main application component.
  - **`index.js`**: The entry point for the React application.

### Server
The server is a Node.js backend application located in the `server/` directory. It includes the following key components:

- **`controllers/`**: Contains controller files for handling business logic, such as `ideaController.js` and `userController.js`.
- **`middleware/`**: Middleware files, such as `auth.js`, for handling authentication and other request processing.
- **`models/`**: Mongoose models for database entities like `Idea` and `User`.
- **`routes/`**: Defines API routes for ideas and users.
- **`server.js`**: The main entry point for the backend server.

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd IdeaIncubator
   ```

2. Install dependencies for both the client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

### Running the Application
1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the frontend client:
   ```bash
   cd ../client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to access the application.

## Features
- User authentication and authorization
- Idea creation, editing, and deletion
- Responsive design with reusable components
- Context-based state management

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any questions or feedback, please contact the project maintainers.
