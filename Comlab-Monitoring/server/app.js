import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './DB/db.js';
import instructorRoute from './routes/instructorRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import qrCodeRoutes from './routes/qrCodeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import googleChatRoutes from './routes/googleChatRoutes.js';
import nodemailer from 'nodemailer';

const app = express();

dotenv.config();

// Security headers for improved protection
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use(express.json());

app.get("/api/test", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'michaelesparcia0@gmail.com',
        pass: 'sjgm mnah tjxp mazg'
    }
  });

  send();

  async function send() {
    const result = await transporter.sendMail({
        from: 'michaelesparcia0@gmail.com',
        to: to,
        subject: 'Hello World',
        text: 'Hello World'
    });

    console.log(result);
  }
});

const port = process.env.PORT || 8000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
};
app.use(cors(corsOptions));

// Define API routes
app.use('/api/instructor', instructorRoute);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/qr-code', qrCodeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', googleChatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server and connect to MongoDB
app.listen(port, '0.0.0.0', async () => {
  try {
    await connect();
    console.log(`Connected to MongoDB and server is running on PORT ${port}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
});

// Graceful shutdown for server
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  process.exit(0);
});
