import mongoose from "mongoose";
const {Schema} = mongoose;

const instructorSchema = new Schema ({
    id:{
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },
    lastname:{
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
