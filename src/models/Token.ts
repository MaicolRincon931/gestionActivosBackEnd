import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  created_at: Date
}

const tokenSchema = new Schema({
  token: { type: String, required: true }, // Unique token string
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Refrences the user who owns this token
  created_at: { type: Date, default: Date.now, expires:"10m" }, // Token auto-expires after 10 minutes
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
