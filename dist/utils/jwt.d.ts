import { Types } from "mongoose";
type UserPayLoad = {
    id: Types.ObjectId;
};
export declare const generateJWT: (payload: UserPayLoad) => string;
export {};
