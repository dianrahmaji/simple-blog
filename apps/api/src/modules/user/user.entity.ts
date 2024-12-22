import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import * as crypto from "crypto";
import { BaseEntity } from "../common/base.entity.js";
import { Article } from "../article/article.entity.js";

@Entity()
export class User extends BaseEntity<"bio"> {
  @Property()
  fullName!: string;

  @Property()
  email!: string;

  @Property({ hidden: true, lazy: true })
  password!: string;

  @Property({ type: "text" })
  bio = "";

  @OneToMany({ mappedBy: "author" })
  articles = new Collection<Article>(this);

  constructor(fullName: string, email: string, password: string) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = this.hashPassword(password);
  }

  private hashPassword(password: string) {
    return crypto.createHmac("sha256", password).digest("hex");
  }
}
