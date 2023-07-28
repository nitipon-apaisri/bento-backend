import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const { JWT_SECRET } = process.env;

export const tokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    try {
        jwt.verify(token, JWT_SECRET as string, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "Token Invalid" });
            } else {
                next();
            }
        });
    } catch (error) {
        res.status(500);
    }
};
