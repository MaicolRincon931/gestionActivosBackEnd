import mongoose from "mongoose";
import colors from "colors"
import { exit } from 'node:process'

// Connect to the database
export const connectDB = async () => {
    try {
        // Try to establish the connection
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.connection.host}:${connection.connection.port}`
        
        // Log success message with the connection details
        console.log(colors.cyan.bold(`MongoDB Conectado en : ${url}`))

    } catch (error) {
        // If connection fails, print an error and stop the process
        console.log(colors.red.bold('Error al conectador a MongoDB'))
        exit(1)
    }
}
