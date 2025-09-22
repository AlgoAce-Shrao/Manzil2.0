import mongoose from "mongoose";
import College from "./models/College.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const colleges = await College.find({});
    console.log(colleges); // Should print all documents
    mongoose.disconnect();
  });
