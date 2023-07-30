import mongoose from "mongoose";
import { menuType } from "../types/menuTypes";

const { Schema } = mongoose;
const menu = {
    _id: String,
    menuNumber: Number,
    name: String,
    description: String,
    price: Number,
    ingredients: [Number],
    tags: [String],
};
const menuSchema = new Schema<menuType>(menu, { timestamps: true });
export const menuModel = mongoose.model<menuType>("menus", menuSchema);
