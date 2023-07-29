import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/userModel";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await req.user;
        const isUserEmpty = await userModel.find().exec();
        if (isUserEmpty.length === 0) {
            next();
        } else {
            const findUser = await userModel.findOne({ _id: user._id });
            const isAdmin = findUser!.role.includes("ADMIN");
            if (isAdmin) {
                next();
            }
        }
    } catch (error) {
        throw new Error(error as string);
    }
};
