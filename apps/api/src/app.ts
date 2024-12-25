import { NotFoundError, RequestContext } from "@mikro-orm/core";
import { fastify } from "fastify";
import { initORM } from "./db.js";
import { registerArticleRoutes } from "./modules/article/routes.js";
import { registerUserRoutes } from "./modules/user/routes.js";
import fastifyJWT from "@fastify/jwt";
import { AuthError } from "./modules/common/utils.js";

export async function bootstrap(port = 3001, migrate = true) {
  const db = await initORM();

  if (migrate) {
    db.orm.migrator.up();
  }

  const app = fastify();

  app.register(fastifyJWT, {
    secret: process.env.JWT_SECRET ?? "12345678",
  });

  app.addHook("onRequest", (_, __, done) => {
    RequestContext.create(db.em, done);
  });

  app.addHook("onRequest", async (request) => {
    try {
      const ret = await request.jwtVerify<{ id: number }>();
      request.user = await db.user.findOneOrFail(ret.id);
    } catch (e) {
      app.log.error(e);
    }
  });

  app.setErrorHandler((error, _, reply) => {
    if (error instanceof AuthError) {
      return reply.status(401).send({ error: error.message });
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({ error: error.message });
    }

    app.log.error(error);
    reply.status(500).send({ error: error.message });
  });

  app.addHook("onClose", async () => {
    await db.orm.close();
  });

  app.register(registerArticleRoutes, { prefix: "article" });
  app.register(registerUserRoutes, { prefix: "user" });

  const url = await app.listen({ port });

  return { app, url };
}
