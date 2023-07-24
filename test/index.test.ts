import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
beforeAll(async () => {
    const exempleMenu = {
        name: "Yakiniku",
        description: "-",
        price: 150,
    };
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "sample-db" });
    // await mongoose.connect(`${process.env.LOCAL_MONGODB_URI}`); //connect to the database before each test
    await request(app).post("/api/v1/menu").send(exempleMenu).set("Accept", "application/json").set("Content-Type", "application/json");
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
        const res = await request(app).post("/api/v1/menu");
        const resText = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resText.message).toEqual("Menu registered successfully");
    });
    test("should return menu", async () => {
        const res = await request(app).get("/api/v1/menu");
        expect(res.status).toBe(200);
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
