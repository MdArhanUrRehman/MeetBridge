import express from "express";
import mongoose from "mongoose";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import userRouter from "./routes/userRoute.js";
import cors from 'cors'
import 'dotenv/config';
import { connectionToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);
connectionToSocket(server);

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

const PORT = process.env.PORT || 8080 ;
connectDB();

app.get("/home", (req, res) => {
    res.send("Working");
});

app.use("/api/v1/user", userRouter);

// io.on("connection", (socket) => {

//     console.log('a user connected');
// })


server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})