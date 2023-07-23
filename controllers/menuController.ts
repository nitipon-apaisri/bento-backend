import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { menuModel } from "../models/menuModel";
import { menuType } from "../types/menuTypes";

export const getMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const menu = await menuModel.find().exec();
        res.status(200).json(menu);
    } catch (error) {
        res.status(500);
    }
};
