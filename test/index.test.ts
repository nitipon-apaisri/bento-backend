import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
const exempleUser = {
    name: "Miyamoto Musashi",
    email: "m.m@mail.com",
    password: "123456789",
    role: ["ADMIN"],
};
const signIn = {
    email: "m.m@mail.com",
    password: "123456789",
};
beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "sample-db" });
    // await mongoose.connect(`${process.env.LOCAL_MONGODB_URI}`); //connect to the database before each test
    await request(app).post("/api/v1/user").send(exempleUser).set("Accept", "application/json").set("Content-Type", "application/json");
});
afterAll(async () => {
    await mongoose.connection.close(); //stop the connection after all test and stop tests leaking due to improper teardown
});
describe("Hello World", () => {
    test("should return Hello World", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toEqual("Hello World!");
    });
});

describe("Menu", () => {
    test("should return 200", async () => {
        const sampleMenu = {
            name: "Yakiniku",
            description: "-",
            price: 150,
        };
        const resSignIn = await request(app).post("/api/v1/signIn").send(signIn).set("Accept", "application/json").set("Content-Type", "application/json");
        const res = await request(app).post("/api/v1/menu").send(sampleMenu).set("Authorization", JSON.parse(resSignIn.text).token);
        const resText = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resText.message).toEqual("Menu registered successfully");
    });
    test("should return menu", async () => {
        const res = await request(app).get("/api/v1/menu");
        expect(res.status).toBe(200);
    });
    test("should return 200 after updated", async () => {
        const resSignIn = await request(app).post("/api/v1/signIn").send(signIn).set("Accept", "application/json").set("Content-Type", "application/json");
        const res = await request(app).get("/api/v1/menu");
        const menuId = JSON.parse(res.text)[0]._id;
        const resUpdate = await request(app).put(`/api/v1/menu/${menuId}`).send({ price: 200 }).set("Authorization", JSON.parse(resSignIn.text).token);
        expect(resUpdate.status).toBe(200);
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
        const res = await request(app).get("/api/v1/users");
        expect(res.status).toBe(404);
    });
});
