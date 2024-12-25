import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Embeddable,
  Embedded,
  Entity,
  EntityRepositoryType,
  EventArgs,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity.js";
import { Article } from "../article/article.entity.js";
import { hash, verify } from "argon2";
import { UserRepository } from "./user.repository.js";

@Embeddable()
export class Social {
  @Property()
  twitter?: string;

  @Property()
  facebook?: string;

  @Property()
  linkedin?: string;
}

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity<"bio"> {
  [EntityRepositoryType]?: UserRepository;

  @Property()
  fullName!: string;

  @Property()
  email!: string;

  /**
   * FIXME:
   * - lazy options makes the verifyPassword method error
   */
  @Property({ hidden: true })
  password!: string;

  @Property({ type: "text" })
  bio = "";

  @Property({ persist: false })
  token?: string;

  @Embedded(() => Social, { object: true })
  social?: Social;

  @OneToMany({ mappedBy: "author" })
  articles = new Collection<Article>(this);

  constructor(fullName: string, email: string, password: string) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<User>) {
    const password = args.changeSet?.payload.password;

    if (password) {
      this.password = await hash(password);
    }
  }

  async verifyPassword(password: string) {
    return verify(this.password, password);
  }
}
