import { RequestContext } from "@mikro-orm/core";
import { fastify } from "fastify";
import { initORM } from "./db.js";

export async function bootstrap(port = 3001, migrate = true) {
  const db = await initORM();

  if (migrate) {
    db.orm.migrator.up();
  }

  const app = fastify();

  app.addHook("onRequest", (_, __, done) => {
    RequestContext.create(db.em, done);
  });

  app.addHook("onClose", async () => {
    await db.orm.close();
  });

  app.get("/article", async (request) => {
    const { limit, offset } = request.query as {
      limit?: number;
      offset?: number;
    };

    const [items, total] = await db.article.findAndCount({}, { limit, offset });

    return { items, total };
  });

  const url = await app.listen({ port });

  return { app, url };
}
