import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { menuModel } from "../models/menuModel";
import { menuType } from "../types/menuTypes";
import { menuAlreadyExists, menuDeleted, menuNotFound, menuRegistered, menuUpdated, missingFields } from "../modules/responseMessages";

export const registerMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, ingredients, tags, price } = req.body;
        const menu: menuType = {
            _id: uuidv4(),
            name: name.toLowerCase(),
            description,
            price,
            ingredients,
            tags,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        if (name === "" || description === "" || price === undefined || name === undefined || description === undefined || ingredients.lenght === 0 || tags.lenght === 0) {
            res.status(missingFields.status).json({ message: missingFields.message });
        } else {
            const findDuplicate = await menuModel.findOne({ name: menu.name.toLowerCase() });
            if (findDuplicate) {
                res.status(menuAlreadyExists.status).json({ message: menuAlreadyExists.message });
            } else {
                const newMenu = new menuModel(menu);
                await newMenu.save();
                res.status(menuRegistered.status).json({ message: menuRegistered.message, menu: menu });
            }
        }
    } catch (error) {
        throw new Error(error as string);
    }
};

export const getMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const menu = await menuModel.find().exec();
        res.status(200).json(menu);
    } catch (error) {
        throw new Error(error as string);
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
            res.status(menuUpdated.status).json({ message: menuUpdated.message, menu: update });
        } else {
            res.status(menuNotFound.status).json({ message: menuNotFound.message });
        }
    } catch (error) {
        throw new Error(error as string);
    }
};

export const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const findMenu = (await menuModel.findOne({ _id: id })) as menuType;
        if (findMenu) {
            await menuModel.deleteOne({ _id: id });
            res.status(menuDeleted.status).json({ message: menuDeleted.message });
        } else {
            res.status(menuNotFound.status).json({ message: menuNotFound.message });
        }
    } catch (error) {
        throw new Error(error as string);
    }
};
