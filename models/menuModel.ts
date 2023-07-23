import mongoose from "mongoose";
import { menuType } from "../types/menuTypes";

const { Schema } = mongoose;
const menuSchema = new Schema<menuType>({ _id: String, name: String, description: String, price: Number });
export const menuModel = mongoose.model<menuType>("menu", menuSchema);
