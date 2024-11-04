import mongoose from "mongoose";
const {Schema} = mongoose;

const instructorSchema = new Schema ({

    name: {
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    }
})
const instructorModel = mongoose.model("instructor", instructorSchema);
export default instructorModel;
