import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      // Remove deprecated options
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

export default connect;