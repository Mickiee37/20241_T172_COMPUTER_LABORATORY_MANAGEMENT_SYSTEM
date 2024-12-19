
import Instructor from "../models/instructor.js";

// Get all instructors
const getInstructors = async (req, res) => {
    try {
      const instructors = await Instructor.find(); // Fetch all instructors
      res.status(200).json(instructors); // Send the full instructor data (including version)
    } catch (error) {
      console.error("Error fetching instructors:", error);
      res.status(500).json({ message: "Failed to fetch instructors" });
    }
  };
  

const getInstructor = async (req, res) => {
    try {
      const instructor = await Instructor.findOne({ id: req.params.id });
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor does not exist.' });
      }
      res.status(200).json(instructor);
    } catch (error) {
      console.error('Error fetching instructor:', error.message);
      res.status(500).json({ message: 'Server error while fetching instructor.' });
    }
  };
// Add a new instructor
const postInstructor = async (req, res) => {
    try {
        const { id, name, lastname, email } = req.body;

        if (!id || !name || !lastname || !email) { // Validate fields
            return res.status(400).json({ message: "Missing required fields: id, name, lastname, and email" });
        }

        const existingInstructor = await Instructor.findOne({ id });
        if (existingInstructor) {
            return res.status(400).json({ message: "Instructor with this ID already exists" });
        }

        const instructor = new Instructor(req.body);
        const savedInstructor = await instructor.save();
        res.status(201).json(savedInstructor);
    } catch (error) {
        console.error("Error adding instructor:", error.message);
        res.status(500).json({ message: "Server error while adding instructor" });
    }
};

const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params; 
        const deletedInstructor = await Instructor.findOneAndDelete({ id });

        if (!deletedInstructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }

        res.status(200).json({ message: "Instructor deleted successfully", instructor: deletedInstructor });
    } catch (error) {
        console.error("Error deleting instructor:", error);
        res.status(500).json({ message: "Failed to delete instructor" });
    }
};
const updateInstructor = async (req, res) => {
    try {
      const { id } = req.params;
      const { version, ...updateData } = req.body;
  
      // Match by ID and version for Optimistic Concurrency Control
      const updatedInstructor = await Instructor.findOneAndUpdate(
        { id, __v: version },
        { $set: updateData, $inc: { __v: 1 } }, // Increment version
        { new: true }
      );
  
      if (!updatedInstructor) {
        return res.status(409).json({
          message: "Conflict detected. Instructor has been updated by someone else.",
        });
      }
  
      res.status(200).json({
        message: "Instructor updated successfully",
        instructor: updatedInstructor,
      });
    } catch (error) {
      console.error("Error updating instructor:", error.message);
      res.status(500).json({ message: "Server error while updating instructor" });
    }
  };
  
  
export { getInstructors, getInstructor, postInstructor, deleteInstructor, updateInstructor };
