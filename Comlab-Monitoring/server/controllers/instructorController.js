
import Instructor from "../models/instructor.js";

// Get all instructors
const getInstructors = async (req, res) => {
    try {
        const instructors = await Instructor.find();
        console.log(instructors);
        res.status(200).json(instructors); // Send data in JSON format
    } catch (error) {
        console.error("Error fetching instructors:", error);
        res.status(500).json({ message: "Failed to fetch instructors" });
    }
};

// Get a specific instructor by ID
const getInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);
        console.log(instructor);
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.status(200).json(instructor); // Send the instructor data
    } catch (error) {
        console.error("Error fetching instructor:", error);
        res.status(500).json({ message: "Failed to fetch instructor" });
    }
};

// Add a new instructor
const postInstructor = async (req, res) => {
    try {
        // Validate input data (example for required fields)
        const { id, name, lastname, email } = req.body;
        if (!id, !name || !lastname || !email) {
            return res.status(400).json({ message: "Missing required fields: name, lastname, and email" });
        }

        // Check for existing instructor by email
        const existingInstructor = await Instructor.findOne({ email });
        if (existingInstructor) {
            return res.status(400).json({ message: "Instructor with this email already exists" });
        }

        // Create and save the new instructor
        const instructor = new Instructor(req.body);
        const savedInstructor = await instructor.save();
        res.status(201).json(savedInstructor); // Created successfully
    } catch (error) {
        console.error("Error adding instructor:", error);
        res.status(500).json({ message: "Failed to add instructor" });
    }
};

const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params; // Custom ID from URL

        // Find and delete by custom ID field
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
        const { id } = req.params; // Custom ID from URL
        const updateData = req.body; // Updated instructor data from the request body

        // Find and update by custom ID field
        const updatedInstructor = await Instructor.findOneAndUpdate(
            { id }, // Query using the custom ID field
            updateData, // New data to update
            { new: true } // Return the updated document
        );

        if (!updatedInstructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }

        res.status(200).json({ message: "Instructor updated successfully", instructor: updatedInstructor });
    } catch (error) {
        console.error("Error updating instructor:", error);
        res.status(500).json({ message: "Failed to update instructor" });
    }
};


export { getInstructors, getInstructor, postInstructor, deleteInstructor, updateInstructor };
