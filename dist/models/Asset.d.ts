import mongoose, { Document, PopulatedDoc } from "mongoose";
import { IUser } from "./User";
export type AssetTypes = Document & {
    name: String;
    comments: String;
    latitude: Number;
    longitude: Number;
    created_at: String;
    icon: String;
    user: PopulatedDoc<IUser & Document>;
};
declare const Asset: mongoose.Model<AssetTypes, {}, {}, {}, mongoose.Document<unknown, {}, AssetTypes> & mongoose.Document<unknown, any, any> & {
    name: String;
    comments: String;
    latitude: Number;
    longitude: Number;
    created_at: String;
    icon: String;
    user: PopulatedDoc<IUser & Document>;
} & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Asset;
