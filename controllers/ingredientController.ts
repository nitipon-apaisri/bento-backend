import { Request, Response, NextFunction } from "express";
import { ingredientModel } from "../models/ingredientModel";
import { ingredientType } from "../types/ingredientTypes";
import { v4 as uuidv4 } from "uuid";

export const getIngredients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingredients = await ingredientModel.find().exec();
        res.status(200).json(ingredients);
    } catch (error) {
        throw new Error(error as string);
    }
};

export const registerIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentTotaltIngredients = await ingredientModel.count().exec();
        const { name, type } = req.body;
        const ingredient: ingredientType = {
            _id: uuidv4(),
            ingredientNumber: currentTotaltIngredients + 1,
            name: name.toLowerCase(),
            type,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const findDuplicate = await ingredientModel.findOne({ name: ingredient.name.toLowerCase() });
        if (findDuplicate) {
            res.status(409).json({ message: "Ingredient already exists" });
        } else {
            const newIngredient = new ingredientModel(ingredient);
            await newIngredient.save();
            res.status(200).json({ message: "Ingredient registered", ingredient: ingredient });
        }
    } catch (error) {
        throw new Error(error as string);
    }
};
