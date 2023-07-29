import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { menuModel } from "../models/menuModel";
import { menuType } from "../types/menuTypes";

export const registerMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, ingredients, price } = req.body;
        const menu: menuType = {
            _id: uuidv4(),
            name: name.toLowerCase(),
            description,
            price,
            ingredients,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        if (name === "" || description === "" || price === undefined || name === undefined || description === undefined || ingredients.lenght === 0) {
            res.status(401).json({ message: "Please fill all the fields" });
        } else {
            const findDuplicate = await menuModel.findOne({ name: menu.name.toLowerCase() });
            if (findDuplicate) {
                res.status(409).json({ message: "Menu already exists", menu: menu });
            } else {
                const newMenu = new menuModel(menu);
                await newMenu.save();
                res.status(200).json({ message: "Menu registered successfully", menu: menu });
            }
        }
    } catch (error) {
        res.status(500);
    }
};

export const getMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const menu = await menuModel.find().exec();
        res.status(200).json(menu);
    } catch (error) {
        res.status(500);
    }
};

export const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, price } = req.body;
        const { id } = req.params;
        const findMenu = (await menuModel.findOne({ _id: id })) as menuType;
        if (findMenu) {
            const update = { name: name ? name : findMenu.name, description: description ? description : findMenu.description, price: price ? price : findMenu.price, updatedAt: Date.now() };
            await menuModel.findOneAndUpdate({ _id: id }, update);
            res.status(200).json({ message: "Menu updated successfully" });
        } else {
            res.status(401).json({ message: "Menu not found" });
        }
    } catch (error) {
        res.status(500);
    }
};

export const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const findMenu = (await menuModel.findOne({ _id: id })) as menuType;
        if (findMenu) {
            await menuModel.deleteOne({ _id: id });
            res.status(200).json({ message: "Menu deleted successfully" });
        } else {
            res.status(401).json({ message: "Menu not found" });
        }
    } catch (error) {
        res.status(500);
    }
};
