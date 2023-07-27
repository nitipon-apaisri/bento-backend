import mongoose from "mongoose";
import { userType } from "../types/userTypes";

const { Schema } = mongoose;
const user = {
    _id: String,
    name: String,
    email: String,
    password: String,
    role: [String],
};
const userSchema = new Schema<userType>(user, { timestamps: true });
export const userModel = mongoose.model<userType>("users", userSchema);
