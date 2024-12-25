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

test("profile", async () => {
  const token = app.jwt.sign({ id: 1 });

  const res1 = await app.inject({
    method: "GET",
    url: "/user/profile",
  });

  expect(res1.json()).toMatchObject({
    error: "Please provide your token via Authorization header",
  });

  const res2 = await app.inject({
    method: "GET",
    url: "/user/profile",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  expect(res2.json()).toMatchObject({
    fullName: "Foo Bar",
    email: "foo@bar.com",
  });

  const res3 = await app.inject({
    method: "PATCH",
    url: "/user/profile",
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      fullName: "Fizz Buzz",
      email: "fizz@buzz.com",
      bio: "fizz buzz",
    },
  });

  expect(res3.json()).toMatchObject({
    fullName: "Fizz Buzz",
    email: "fizz@buzz.com",
    bio: "fizz buzz",
  });
});
