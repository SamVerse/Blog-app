import mongoose from "mongoose";

const dbConnection = async (PORT) => {
    try {
        await mongoose.connect(PORT);
        console.log('Connected to database');
    } catch (error) {
        console.log('Error in connecting to database');
    }
}

export default dbConnection;