import { Options, SqliteDriver } from "@mikro-orm/sqlite";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SeedManager } from "@mikro-orm/seeder";
import { Migrator } from "@mikro-orm/migrations";

import { User } from "./modules/user/user.entity.js";
import { Article } from "./modules/article/article.entity.js";
import { Tag } from "./modules/article/tag.entity.js";

const config: Options = {
  driver: SqliteDriver,
  dbName: "sqlite.db",
  entities: [
    //
    User,
    Article,
    Tag,
  ],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  extensions: [SeedManager, Migrator],
  migrations: {
    snapshot: false,
  },
};

export default config;
