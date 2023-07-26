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

export const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, price } = req.body;
        const { id } = req.params;
        const findMenu = (await menuModel.findOne({ _id: id })) as menuType;
        if (findMenu) {
            const update = { name: name ? name : findMenu.name, description: description ? description : findMenu.description, price: price ? price : findMenu.price };
            const menu = await menuModel.findOneAndUpdate({ _id: id }, update);
            res.status(200).json({ message: "Menu updated successfully" });
        } else {
            res.status(401).json({ message: "Menu not found" });
        }
    } catch (error) {
        res.status(500);
    }
};
