import mongoose from "mongoose";

export const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!, { dbName: "techbyte" });

        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("MongoDB connected successfully!");
        });
        connection.on("error", (error: Error) => {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        });
        connection.on("disconnected", () => {
            console.log("MongoDB disconnected!");
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};