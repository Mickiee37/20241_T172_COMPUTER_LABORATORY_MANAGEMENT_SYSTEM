import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './DB/db.js'; // MongoDB connection
import instructorRoute from './routes/instructorRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js'; // Dashboard route
import userRoutes from './routes/userRoutes.js'; // User routes for registration and login
import qrCodeRoutes from './routes/qrCodeRoutes.js'; // Import QR code routes
import attendanceRoutes from './routes/attendanceRoutes.js'; // Import attendance routes

const app = express();

dotenv.config();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.json());

const port = process.env.PORT || 8000;

const corsOptions = {
  origin: ["http://localhost:3000"], // Your frontend URL
};
app.use(cors(corsOptions));

// Define API routes
app.use('/api/instructor', instructorRoute);
app.use('/api/dashboard', dashboardRoutes);  // Dashboard route
app.use('/api/users', userRoutes);  // User routes for registration and login
app.use('/api/qr-code', qrCodeRoutes);  // Register QR code routes
app.use('/api/attendance', attendanceRoutes); // Register attendance route

// Start the server and connect to MongoDB
app.listen(port, async () => {
  try {
    await connect(); // Connect to MongoDB
    console.log(`Connected to MongoDB and server is running on PORT ${port}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
});
