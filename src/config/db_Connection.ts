import mongoose from "mongoose";
import { config } from "dotenv";

const db_Connection = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_STRING ?? '');
        console.log('Database connected successfully as host: ' + connection.connection.host);
    } catch (error) {
        console.log('Database connection failed');
    }
}


export default db_Connection;