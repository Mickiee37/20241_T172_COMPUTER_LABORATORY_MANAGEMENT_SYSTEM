import mongoose from "mongoose";
const { Schema } = mongoose;

const instructorSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // Ensure id is unique
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
      type: Date,
    },
    timeOut: {
      type: Date,
    },
    version: {
      type: Number,
      default: 0, // Add version field for optimistic concurrency control
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Pre-save hook to increment the version
instructorSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (update && update.$set) {
    if (!update.$set.version) update.$set.version = 0; // Initialize if not set
    update.$set.version += 1; // Increment version by 1
  }
});

const Instructor =
  mongoose.models.Instructor || mongoose.model("Instructor", instructorSchema);

export default Instructor;
