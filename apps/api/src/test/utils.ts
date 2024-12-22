import { bootstrap } from "../app.js";
import { initORM } from "../db.js";
import config from "../mikro-orm.config.js";
import { TestSeeder } from "../seeders/TestSeeder.js";

export async function initTestApp(port: number) {
  const { orm } = await initORM({
    ...config,
    debug: false,
    dbName: ":memory:",
  });

  await orm.schema.createSchema();
  await orm.seeder.seed(TestSeeder);

  const { app } = await bootstrap(port);

  return app;
}
