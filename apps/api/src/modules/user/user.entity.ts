import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity.js";
import { Article } from "../article/article.entity.js";

@Entity()
export class User extends BaseEntity<"bio"> {
  @Property()
  fullName!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property({ type: "text" })
  bio = "";

  @OneToMany({ mappedBy: "author" })
  articles = new Collection<Article>(this);
}
