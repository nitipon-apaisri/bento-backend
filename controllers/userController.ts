import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { userType } from "../types/userTypes";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        res.status(500);
    }
};

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
            createdAt: new Date(),
            updatedAt: new Date(),
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

export const updateUser = async (req: Request, res: Response) => {
    const { name, email, role } = req.body;
    const { id } = req.params;
    const findUser = (await userModel.findOne({ _id: id })) as userType;

    if (findUser) {
        const update = {
            name: name ? name : findUser.name,
            email: email ? email : findUser.email,
            password: findUser.password,
            role: role ? role : findUser.role,
            updatedAt: Date.now(),
        };
        await userModel.findOneAndUpdate({ _id: id }, update);
        res.status(200).json({ message: "User updated successfully" });
    } else {
        res.status(401).json({ message: "User not found" });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.params;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await userModel.findById({ _id: id }).then((user) => {
        user!.password = hashedPassword;
        user!.save();
    });
    res.status(200).json({ message: "Password updated successfully" });
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (password === "" || email === "" || password === undefined || email === undefined) {
            res.status(401).json({ message: "Please fill all the fields" });
        } else {
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
        }
    } catch (error) {
        res.status(500);
    }
};
