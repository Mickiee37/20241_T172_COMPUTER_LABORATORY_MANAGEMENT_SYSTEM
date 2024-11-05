// DB/Lab.js
import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
  labNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  currentUser: {
    name: String,
    date: String,
    timeIn: String,
  },
});

const Lab = mongoose.model("Lab", labSchema);

export default Lab;
