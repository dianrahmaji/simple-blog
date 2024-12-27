import { Migration } from '@mikro-orm/migrations';

export class Migration20241227143405 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index \`comment_user_id_index\`;`);

    this.addSql(`alter table \`comment\` rename column \`user_id\` to \`author_id\`;`);
    this.addSql(`create index \`comment_author_id_index\` on \`comment\` (\`author_id\`);`);
  }

}
