import mongoose from "mongoose";
const { Schema } = mongoose;

const instructorSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    timeIn: {
      type: Date, // Stores the time when the instructor enters
    },
    timeOut: {
      type: Date, // Stores the time when the instructor exits
    },
  },
  {
    timestamps: true, // For tracking when the document was created or updated
  }
);

const instructorModel = mongoose.model("Instructor", instructorSchema);
export default instructorModel;
