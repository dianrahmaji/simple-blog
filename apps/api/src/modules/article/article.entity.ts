import { Entity, ManyToOne, Property, t } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity.js";
import { User } from "../user/user.entity.js";

function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]/g, "")
    .replace(/ +/g, "-");
}

@Entity()
export class Article extends BaseEntity<"slug" | "description"> {
  @Property({ unique: true })
  slug!: string;

  @Property({ index: true })
  title!: string;

  @Property({ length: 1000 })
  description!: string;

  @Property({ type: t.text, lazy: true })
  text!: string;

  @ManyToOne()
  author!: User;

  constructor(title: string, text: string, author: User) {
    super();
    this.title = title;
    this.text = text;
    this.author = author;
    this.slug = convertToSlug(title);
    this.description = this.text.substring(0, 99) + "...";
  }
}
