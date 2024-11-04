import express from "express"
import {getInstructors, getInstructor, postInstructor, deleteInstructor, updateInstructor} from "../controller/instructorController.js"

const router = express.Router();

router.get("/", getInstructors);

router.get("/:id", getInstructor);

router.post("/", postInstructor);

router.delete("/:id", deleteInstructor);

router.put("/:id", updateInstructor);

export default router;