import { MikroORM } from "@mikro-orm/sqlite";
import { User } from "./modules/user/user.entity.js";
import { Article } from "./modules/article/article.entity.js";
import { Tag } from "./modules/article/tag.entity.js";

const orm = await MikroORM.init();

await orm.schema.refreshDatabase();

const user = new User("Foo bar", "foo@bar.com", "123456");
const em = orm.em.fork();

await em.persist(user).flush();

em.clear();

em.create(Article, {
  title: "Foo",
  text: "Lorem impsum dolor sit amet",
  author: user.id,
});

await em.flush();

const myUser = await em.findOneOrFail(User, user.id, {
  populate: ["articles"],
});

const [article] = myUser.articles;

const newTag = em.create(Tag, {
  name: "new",
});
const oldTag = em.create(Tag, {
  name: "old",
});

article.tags.add(newTag, oldTag);
await em.flush();

article.tags.remove(oldTag);
await em.flush();

orm.close();
