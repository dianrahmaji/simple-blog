import { MikroORM, RequestContext } from "@mikro-orm/core";
import { fastify } from "fastify";
import { Article } from "./modules/article/article.entity.js";

export async function bootstrap(port = 3001) {
  const orm = await MikroORM.init();
  const app = fastify();

  app.addHook("onRequest", (_, __, done) => {
    RequestContext.create(orm.em, done);
  });

  app.addHook("onClose", async () => {
    await orm.close();
  });

  app.get("/article", async (request) => {
    const { limit, offset } = request.query as {
      limit?: number;
      offset?: number;
    };

    const [items, total] = await orm.em.findAndCount(
      Article,
      {},
      { limit, offset }
    );

    return { items, total };
  });

  const url = await app.listen({ port });

  return { app, url };
}
