import { Migration } from '@mikro-orm/migrations';

export class Migration20241225152402 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`user\` add column \`social\` json null;`);
  }

}
