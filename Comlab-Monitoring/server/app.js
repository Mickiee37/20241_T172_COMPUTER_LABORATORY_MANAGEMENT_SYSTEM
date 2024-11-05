import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./DB/db.js";  // Import the connection function

const app = express();
dotenv.config();
app.use(express.json());

const port = process.env.PORT;

const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
};
app.use(cors(corsOptions));

// Routes
import instructorRoute from "./routes/instructorRoutes.js";
import dashboardRoute from "./routes/dashboardRoutes.js"; // Import dashboard route

app.use("/api/instructor", instructorRoute);
app.use("/api/dashboard", dashboardRoute);  // Use dashboard route

// Start the server and connect to MongoDB
app.listen(port, () => {
    connect();  // Connect to MongoDB
    console.log(`Connected to PORT ${port}`);
});
