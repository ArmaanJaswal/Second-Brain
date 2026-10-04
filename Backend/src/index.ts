import 'dotenv/config'
import express from "express";
import userRoutes from './routes/userRoutes.js'
import brainRoutes from './routes/brainRoutes.js'
import shareRoutes from './routes/sharingRoutes.js'
import { connectDB } from './config/connectDB.js';
const app = express();


app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello World")
})

connectDB();

app.use("/api/user",userRoutes);
app.use("/api/brain",brainRoutes);
app.use("/api/share",shareRoutes);

console.log(process.env.PORT);

app.listen(process.env.PORT,()=>{
    console.log(`App is running on port ${process.env.PORT}`)
})