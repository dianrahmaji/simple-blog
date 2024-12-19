import { Options, SqliteDriver } from "@mikro-orm/sqlite";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import { User } from "./modules/user/user.entity.js";

const config: Options = {
  driver: SqliteDriver,
  dbName: "sqlite.db",
  entities: [
    //
    User,
  ],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
};

export default config;
