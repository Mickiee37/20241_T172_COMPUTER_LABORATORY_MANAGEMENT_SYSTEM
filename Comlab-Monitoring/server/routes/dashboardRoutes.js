// routes/dashboardRoutes.js
import express from "express";
import Lab from "../DB/Lab.js"; // Import the Lab model

const router = express.Router();

router.get("/labs", async (req, res) => {
  try {
    const labs = await Lab.find(); // Fetch all labs from the database
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving lab data" });
  }
});

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

export default router;
