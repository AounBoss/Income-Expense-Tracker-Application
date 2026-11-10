const PORT = 3000;
import mongoose from "mongoose";
import { DB_NAME } from "./constraint.js";
const connectDB = async () => {
  try {
    console.log("DB_NAME: ", DB_NAME)
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `/n MONGODB connected !!! ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};
export default connectDB;
