import mongoose from "mongoose";
import { ingredientType } from "../types/ingredientTypes";

const { Schema } = mongoose;
const ingredient = {
    _id: String,
    ingredientNumber: Number,
    name: String,
    type: String,
};
const ingredientSchema = new Schema<ingredientType>(ingredient, { timestamps: true });
export const ingredientModel = mongoose.model<ingredientType>("ingredients", ingredientSchema);
