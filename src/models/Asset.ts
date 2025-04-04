import mongoose, { Schema, Document, Decimal128, PopulatedDoc } from "mongoose";
import { IUser } from "./User";

// Define the structure for an asset document in MongoDB
export type AssetTypes = Document & {
    name: String;
    comments: String;
    latitude: Number;
    longitude: Number;
    created_at: String;
    icon: String;
    user: PopulatedDoc<IUser & Document>; // Reference to the user who owns the asset
};

// Define the schema for an asset
const AssetSchema: Schema = new Schema({
    name: {
        type: String,
        require: true, 
        trim: true,
    },
    comments: {
        type: String,
        require: true,
        trim: true,
    },
    latitude: {
        type: Number,
        require: true,
        trim: true,
    },
    longitude: {
        type: Number,
        require: true,
        trim: true,
    },
    created_at: {
        type: String,
        require: true,
        trim: true,
    },
    icon: {
        type: String,
        require: true,
        enum: ["motor.png", "pozo.png", "transformador.png"], 
        default: "motor.png", // Default value
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", 
    },
});

// Create the model and export it
const Asset = mongoose.model<AssetTypes>("Asset", AssetSchema);
export default Asset;
