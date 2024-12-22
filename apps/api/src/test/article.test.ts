import { afterAll, beforeAll, expect, test } from "vitest";
import { FastifyInstance } from "fastify";
import { initTestApp } from "./utils.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = await initTestApp(30001);
});

afterAll(async () => {
  await app.close();
});

test("list all articles", async () => {
  const res = await app.inject({
    method: "GET",
    url: "/article",
  });

  expect(res.statusCode).toBe(200);

  expect(res.json()).toMatchObject({
    items: [],
    total: 0,
  });
});
