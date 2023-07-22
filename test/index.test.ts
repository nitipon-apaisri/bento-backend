import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
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
        expect(res.status).toBe(404);
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
