import mongoose from "mongoose";

export const connectToDb = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGO_URL);
  mongoose.connection
    .once("open", () => console.log("Connected to Mongo!"))
    .on("error", (error) => console.log("Error connecting to Mongo:", error));
};
