import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { userType } from "../types/userTypes";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, salt);
        const user: userType = {
            _id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            role: role ? role : ["CUSTOMER"],
        };
        if (name === "" || email === "" || password === "" || name === undefined || email === undefined || password === undefined) {
            res.status(401).json({ message: "Please fill all the fields" });
        } else {
            const findDuplicate = await userModel.findOne({ email: user.email });
            if (findDuplicate) {
                res.status(409).json({ message: "User already exists" });
            } else {
                const newUser = new userModel(user);
                await newUser.save();
                res.status(200).json({ message: "User registered successfully" });
            }
        }
    } catch (error) {
        res.status(500);
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        const validPassword = await bcrypt.compare(password, user!.password);
        if (!validPassword) {
            res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({ message: "User signed in successfully", token: jwt.sign({ _id: user?._id, email: user?.email }, process.env.JWT_SECRET as string) });
        if (password === user!.password) {
            if (user) {
            } else {
                res.status(401).json({ message: "User not found" });
            }
        }
    } catch (error) {
        res.status(500);
    }
};
