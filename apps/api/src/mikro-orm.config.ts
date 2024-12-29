import {
  GeneratedCacheAdapter,
  Options,
  SqliteDriver,
} from "@mikro-orm/sqlite";
import { SeedManager } from "@mikro-orm/seeder";
import { Migrator } from "@mikro-orm/migrations";
import { existsSync, readFileSync } from "node:fs";

import { Article } from "./modules/article/article.entity.js";
import { Comment } from "./modules/article/comment.entity.js";
import { Social, User } from "./modules/user/user.entity.js";
import { Tag } from "./modules/article/tag.entity.js";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { ArticleListing } from "./modules/article/article-listing.entity.js";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const options: Options = {};

if (process.env.PRODUCTION && existsSync("./temp/metadata.json")) {
  options.metadataCache = {
    enabled: true,
    adapter: GeneratedCacheAdapter,
    options: {
      data: JSON.parse(
        readFileSync("./temp/metadata.json", { encoding: "utf8" })
      ),
    },
  };
} else {
  options.metadataProvider = (
    await import("@mikro-orm/reflection")
  ).TsMorphMetadataProvider;
}

const config: Options = {
  driver: SqliteDriver,
  dbName: "sqlite.db",
  entities: [
    //
    Article,
    ArticleListing,
    Comment,
    Tag,

    User,
    Social,
  ],
  debug: true,
  extensions: [SeedManager, Migrator],
  migrations: {
    snapshot: false,
  },
  highlighter: new SqlHighlighter({}),
  ...options,
};

export default config;
