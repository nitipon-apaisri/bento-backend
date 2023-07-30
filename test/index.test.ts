import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { menuType } from "../types/menuTypes";
import { userType } from "../types/userTypes";
import { ingredientType } from "../types/ingredientTypes";

const exempleUser: userType = {
    _id: "1",
    name: "Miyamoto Musashi",
    email: "m.m@mail.com",
    password: "123456789",
    role: ["ADMIN"],
    createdAt: new Date(),
    updatedAt: new Date(),
};
const signIn = {
    email: "m.m@mail.com",
    password: "123456789",
};
const sampleMenu: menuType = {
    _id: "1",
    menuNumber: 1,
    name: "Yakiniku",
    description: "-",
    ingredients: ["beef", "salt", "pepper"],
    tags: ["wok"],
    price: 150,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const sampleIngredients = [
    {
        name: "beef",
        description: "beef",
        type: "meat",
    },
    {
        name: "salt",
        description: "salt",
        type: "spice",
    },
    {
        name: "pepper",
        description: "pepper",
        type: "spice",
    },
];

let token: string;

beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "sample-db" });
    // await mongoose.connect(`${process.env.LOCAL_MONGODB_URI}`); //connect to the database before each test
    await request(app).post("/api/v1/user").send(exempleUser).set("Accept", "application/json").set("Content-Type", "application/json");
    const res = await request(app).post("/api/v1/signIn").send(signIn).set("Accept", "application/json").set("Content-Type", "application/json");
    token = JSON.parse(res.text).token;
});
afterAll(async () => {
    await mongoose.connection.close(); //stop the connection after all test and stop tests leaking due to improper teardown
});

describe("Menu", () => {
    test("should return 200 after registered menu", async () => {
        const res = await request(app).post("/api/v1/menu").send(sampleMenu).set("Authorization", token);
        const resText = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resText.message).toEqual("Menu registered successfully");
    });
    test("should return all menus", async () => {
        const res = await request(app).get("/api/v1/menu");
        expect(res.status).toBe(200);
    });
    test("should return 200 after updated", async () => {
        const res = await request(app).get("/api/v1/menu");
        const menuId = JSON.parse(res.text)[0]._id;
        const resUpdate = await request(app).patch(`/api/v1/menu/${menuId}`).send({ price: 200 }).set("Authorization", token);
        expect(resUpdate.status).toBe(200);
    });
    test("should return 200 after deleted", async () => {
        const res = await request(app).get("/api/v1/menu");
        const menuId = JSON.parse(res.text)[0]._id;
        const resDelete = await request(app).delete(`/api/v1/menu/${menuId}`).set("Authorization", token);
        expect(resDelete.status).toBe(200);
    });
});

describe("Order", () => {
    test("should return orders", async () => {
        const res = await request(app).get("/api/v1/orders");
        expect(res.status).toBe(404);
    });
});

describe("User", () => {
    test("should return users", async () => {
        const res = await request(app).get("/api/v1/users").set("Authorization", token);
        expect(res.status).toBe(200);
    });
    test("should return 200 after changed password", async () => {
        const res = await request(app).get("/api/v1/users").set("Authorization", token);
        const userId = JSON.parse(res.text)[0]._id;
        const resUpdate = await request(app).patch(`/api/v1/user/${userId}/changePassword`).send({ password: "123" }).set("Authorization", token);
        expect(resUpdate.status).toBe(200);
    });
    test("should return 200 after updated", async () => {
        signIn.password = "123";
        const res = await request(app).get("/api/v1/users").set("Authorization", token);
        const userId = JSON.parse(res.text)[0]._id;
        const resUpdate = await request(app).patch(`/api/v1/user/${userId}`).send({ email: "m.ms@mail.com" }).set("Authorization", token);
        expect(resUpdate.status).toBe(200);
    });
    test("should return 200 after deleted", async () => {
        const res = await request(app).get("/api/v1/users").set("Authorization", token);
        const userId = JSON.parse(res.text)[0]._id;
        const resDelete = await request(app).delete(`/api/v1/user/${userId}`).set("Authorization", token);
        expect(resDelete.status).toBe(200);
    });
});

describe("Reset password", () => {
    test("should return reset password link", async () => {
        const res = await request(app).post("/api/v1/get-reset-password-link").send({ email: "m.ms@mail.com" }).set("Accept", "application/json").set("Content-Type", "application/json");
        expect(res.status).toBe(200);
        expect(JSON.parse(res.text)).toHaveProperty("link");
    });
});

describe("Ingredient", () => {
    test("should return 200 after registered ingredient", async () => {
        for (let i of sampleIngredients) {
            const res = await request(app).post("/api/v1/ingredient").send(i).set("Authorization", token);
            expect(res.status).toBe(200);
        }
    });
    test("should return all ingredients", async () => {
        const res = await request(app).get("/api/v1/ingredients").set("Authorization", token);
        expect(res.status).toBe(200);
    });
});
