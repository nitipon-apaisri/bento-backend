import mongoose from "mongoose";
import { userType } from "../types/userTypes";

const { Schema } = mongoose;
const userSchema = new Schema<userType>({ _id: String, name: String, email: String, password: String, role: [String] });
export const userModel = mongoose.model<userType>("users", userSchema);
