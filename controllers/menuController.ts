import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { menuModel } from "../models/menuModel";
import { menuType } from "../types/menuTypes";
export const registerMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, price } = req.body;
        const menu: menuType = {
            _id: uuidv4(),
            name,
            description,
            price,
        };
        const findDuplicate = await menuModel.findOne({ name: menu.name });
        if (findDuplicate) {
            res.status(409).json({ message: "Menu already exists" });
        } else {
            const newMenu = new menuModel(menu);
            await newMenu.save();
            res.status(200).json({ message: "Menu registered successfully" });
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
