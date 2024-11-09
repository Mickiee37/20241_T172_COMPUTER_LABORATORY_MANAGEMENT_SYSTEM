import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./DB/db.js"; // MongoDB connection
import instructorRoute from "./routes/instructorRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"; // Dashboard route
import userRoutes from "./routes/userRoutes.js"; // Correct import statement

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

// Routes
app.use("/api/instructor", instructorRoute);
app.use("/api/dashboard", dashboardRoutes); // Use dashboard route
app.use("/api/users", userRoutes); // Use user routes for registration and login

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
