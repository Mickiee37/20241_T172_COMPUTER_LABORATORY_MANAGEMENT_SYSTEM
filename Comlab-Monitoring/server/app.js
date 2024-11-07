import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./DB/db.js"; // Import the MongoDB connection function
import instructorRoute from "./routes/instructorRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"; // Import dashboard route

const app = express();
dotenv.config();
app.use(express.json());

// Set the Cross-Origin-Opener-Policy header globally
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
});

const port = process.env.PORT || 5000; // Default to port 5000 if not defined in .env

const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/instructor", instructorRoute);
app.use("/api/dashboard", dashboardRoutes);  // Use dashboard route

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
