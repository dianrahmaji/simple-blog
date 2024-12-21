import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity.js";

@Entity()
export class User extends BaseEntity {
  @Property()
  fullName!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property({ type: "text" })
  bio = "";
}
