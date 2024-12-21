import { MikroORM, wrap } from "@mikro-orm/sqlite";
import { User } from "./modules/user/user.entity.js";

const orm = await MikroORM.init();

await orm.schema.refreshDatabase();

const user = new User();
user.email = "foo@bar.com";
user.fullName = "Foo bar";
user.password = "123456";

const em = orm.em.fork();

await em.persist(user).flush();
console.log("user id is:", user.id);

const myUser = await em.findOne(User, user.id);
console.log("are users the same", user === myUser);

user.bio = "...";
await em.flush();

const em2 = em.fork();
console.log("verify the EM ids are different", em.id, em2.id);

const myUser2 = await em2.findOneOrFail(User, user.id);
console.log(
  "users are no longer the same, as the came from different EM:",
  myUser === myUser2
);

myUser2.bio = "changed";
await em.refresh(myUser2);
console.log("changes were lost", myUser2);

myUser2.bio = "some change will be saved";
await em2.flush();

await em2.remove(myUser2).flush();

orm.close();
