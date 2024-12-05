import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './DB/db.js'; // MongoDB connection
import instructorRoute from './routes/instructorRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js'; // Dashboard route
import userRoutes from './routes/userRoutes.js'; // User routes for registration and login
import qrCodeRoutes from './routes/qrCodeRoutes.js'; // Import QR code routes
import attendanceRoutes from './routes/attendanceRoutes.js'; // Import attendance routes
import labRoutes from './routes/labRoutes.js';
import googleSheetRoutes from './routes/googleSheetRouter.js'; // Import Google Sheet route
import { scanQRCode } from './controllers/qrController.js';
const app = express();

dotenv.config();

// Middleware for Cross-Origin policies
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Parse JSON requests
app.use(express.json());

// Define the server port
const port = process.env.PORT || 8000;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.255.244:3000",
  ],
};
app.use(cors(corsOptions));

// Define API routes
app.use('/api/instructor', instructorRoute);
app.use('/api/dashboard', dashboardRoutes);  // Dashboard route
app.use('/api/users', userRoutes);  // User routes for registration and login
app.use('/api/qr-code', qrCodeRoutes);  // Register QR code routes
app.use('/api/attendance', attendanceRoutes); // Register attendance route
app.use('/api/labs', labRoutes);
app.use('/api', googleSheetRoutes); // Register Google Sheet route
app.get('/api/qr-code/scan', scanQRCode);

app.listen(port, '0.0.0.0', async () => {
  try {
    await connect(); // Connect to MongoDB
    console.log(`Connected to MongoDB and server is running on http://192.168.255.244:${port}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); 
  }
});
