import mongoose from "mongoose";

const connectDb = async (mongo_URl) => {
  try {
    await mongoose.connect(mongo_URl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message || "Connection error");
  }
};
export default connectDb;
