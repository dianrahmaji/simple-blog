import { MikroORM, wrap } from "@mikro-orm/sqlite";
import { User } from "./modules/user/user.entity.js";
import { Article } from "./modules/article/article.entity.js";

const orm = await MikroORM.init();

await orm.schema.refreshDatabase();

const user = new User();
user.email = "foo@bar.com";
user.fullName = "Foo bar";
user.password = "123456";

const em = orm.em.fork();

await em.persist(user).flush();

em.clear();

em.create(Article, {
  title: "Foo",
  text: "Lorem impsum dolor sit amet",
  author: user.id,
});

await em.flush();

orm.close();
