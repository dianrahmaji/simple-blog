import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, expect, test } from "vitest";
import { initTestApp } from "./utils.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = await initTestApp(30002);
});

afterAll(async () => {
  await app.close();
});

test("login", async () => {
  const res1 = await app.inject({
    method: "POST",
    url: "/user/sign-in",
    payload: {
      email: "foo@bar.com",
      password: "password123",
    },
  });

  expect(res1.statusCode).toBe(200);
  expect(res1.json()).toMatchObject({
    fullName: "Foo Bar",
  });

  const res2 = await app.inject({
    method: "POST",
    url: "/user/sign-in",
    payload: {
      email: "foo@bar.com",
      password: "password456",
    },
  });

  expect(res2.statusCode).toBe(401);
  expect(res2.json()).toMatchObject({
    error: "Invalid combination of email and password",
  });
});
