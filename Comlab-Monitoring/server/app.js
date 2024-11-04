import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

const app = express()
dotenv.config()
app.use(express.json())

const port = process.env.PORT

const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
};
app.use(cors(corsOptions));

//Routes
import instructorRoute from "./routes/instructorRoutes.js"

app.use("/api/instructor", instructorRoute);

const connect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB)
    }catch(error){
        console.log(error);
    }
}

mongoose.connection.on("disconnected", () =>{
    console.log("Disconnected from MongoDB");
})

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
})
app.listen(port, () => {
    connect();
    console.log(`Connected to PORT ${port}`);
})