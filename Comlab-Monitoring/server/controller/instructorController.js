import mongoose from "mongoose";
import Instructor from "../models/instructor.js"


const getInstructors = async (req, res) => {
    try{
        const instructor = await Instructor.find();
        res.send(instructor);
    }catch(error){
        console.log(error)
    }
}

const getInstructor = async (req, res) => {
    try{
        const instructor = await Instructor.findById(req.params.id)
        res.send(instructor);
    }catch(error){
        console.log(error);
    }
}

const postInstructor = async (req, res) => {
    try{
        const instructor = new Instructor(req.body);
        const savedInstructor = await instructor.save();
        res.status(200).json(savedInstructor);
    }catch(error){
        console.log(error);
    }
}

const deleteInstructor = async (req, res) => {
    try{
        const instructor = await Instructor.findByIdAndDelete(req.params.id)
        if(!instructor){
            return res.status(404).json({message: "Instructor not found"});
        }

        res.status(200).json({message: "Instructor deleted Successfully"})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Failed to delete Instructor"});
    }

}

const updateInstructor = async (req, res) => {
    try{
        const instructor = await Instructor.findById(req.params.id)
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        instructor.name = req.body.name || instructor.name;
        instructor.lastname = req.body.lastname || instructor.lastname;
        instructor.gender = req.body.gender || instructor.gender;
        instructor.email = req.body.email || instructor.email;

        const updatedInstructor = await instructor.save();
        res.status(200).json(updatedInstructor);

    }catch(error){
        console.log(error)
    }
}

export {getInstructors, getInstructor, postInstructor, deleteInstructor, updateInstructor}