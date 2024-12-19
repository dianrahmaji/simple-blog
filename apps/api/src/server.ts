import { MikroORM } from "@mikro-orm/sqlite";

const orm = await MikroORM.init();
orm.close();
