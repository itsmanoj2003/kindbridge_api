import mongoose from "mongoose";
import dotenv from "dotenv"


import app from "./app.js"

dotenv.config()


mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log("Mongo DB Connected")
  app.listen(process.env.PORT, ()=>{
    console.log(`Server running in ${process.env.PORT}`)
  })}
)
.catch((error) => console.log("Server Error",error.message))

