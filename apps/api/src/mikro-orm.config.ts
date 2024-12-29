import { Options, SqliteDriver } from "@mikro-orm/sqlite";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SeedManager } from "@mikro-orm/seeder";
import { Migrator } from "@mikro-orm/migrations";

import { Article } from "./modules/article/article.entity.js";
import { Comment } from "./modules/article/comment.entity.js";
import { Social, User } from "./modules/user/user.entity.js";
import { Tag } from "./modules/article/tag.entity.js";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { ArticleListing } from "./modules/article/article-listing.entity.js";

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
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  extensions: [SeedManager, Migrator],
  migrations: {
    snapshot: false,
  },
  highlighter: new SqlHighlighter({}),
};

export default config;
