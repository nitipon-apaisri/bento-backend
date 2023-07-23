import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
beforeAll(async () => {
    await mongoose.connect(`${process.env.LOCAL_MONGODB_URI}`); //connect to the database before each test
    // await request(app).post("/api/register").send(exempleUser).set("Accept", "application/json").set("Content-Type", "application/json");
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
