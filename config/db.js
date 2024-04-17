import mongoose from "mongoose";
import colors from "colors";

const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Successfully connected to Mongo DB ${conn.connection.host}`.bgMagenta.white);

    } catch (error) {
        console.log(`Error in MongoDB ${error}`.bgRed.white)
    }
}

export default connectToDB;
