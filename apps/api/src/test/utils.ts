import { bootstrap } from "../app.js";
import { initORM } from "../db.js";
import config from "../mikro-orm.config.js";

export async function initTestApp(port: number) {
  const { orm } = await initORM({
    ...config,
    debug: false,
    dbName: ":memory:",
  });

  await orm.schema.createSchema();

  const { app } = await bootstrap(port);

  return app;
}
