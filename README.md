# Movie Recommendation App

This is a full-stack movie recommendation application with a Node.js/Express backend and a React frontend.

## Features
- User authentication (JWT-based)
- Movie recommendations
- Responsive frontend UI
- MongoDB database integration

## Project Structure
```
backend/           # Node.js/Express backend
  server.js        # Main server file
  models/          # Mongoose models
  routes/          # Express routes
  .env             # Environment variables
frontend/frontend/ # React frontend (create-react-app)
  src/             # React source code
  public/          # Static files
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn
- MongoDB (local or remote)

### Backend Setup
1. Go to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file (see `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movie-recommendation-app
   JWT_SECRET=your_strong_jwt_secret_here
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Go to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```

The frontend will run on `http://localhost:3000` by default and the backend on `http://localhost:5000`.

## Environment Variables
- `PORT`: Port for the backend server (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication

## Notes
- Ensure MongoDB is running and accessible at the URI you provide.
- Update the frontend API URLs if your backend runs on a different host/port.

## License
MIT
