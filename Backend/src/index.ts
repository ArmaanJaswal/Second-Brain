import 'dotenv/config'
import express from "express";
import userRoutes from './routes/userRoutes.js'
import brainRoutes from './routes/brainRoutes.js'
import shareRoutes from './routes/sharingRoutes.js'
const app = express();


app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.use("/api/user",userRoutes);
app.use("/api/brain",brainRoutes);
app.use("/api/share",shareRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`App is running on port 3000 ${process.env.PORT}`)
})