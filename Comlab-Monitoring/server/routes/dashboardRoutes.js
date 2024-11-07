// routes/dashboardRoutes.js
import express from "express";
import Lab from "../DB/db.js"; // Import the Lab model
import { verifyAuthToken } from "../middleware/auth.js";

const router = express.Router();

// Public route to get all labs
router.get("/labs", async (req, res) => {
  try {
    const labs = await Lab.find(); // Fetch all labs from the database
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving lab data" });
  }
});

// Public route to create a new lab
router.post("/labs", async (req, res) => {
  try {
    const { labNumber, currentUser } = req.body;
    const lab = new Lab({ labNumber, currentUser });
    await lab.save();
    res.status(201).json(lab);
  } catch (error) {
    res.status(500).json({ message: "Error creating lab data" });
  }
});

// Secured route that requires token verification
router.get("/secure-data", verifyAuthToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
