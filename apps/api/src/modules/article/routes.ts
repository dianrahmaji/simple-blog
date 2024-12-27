import { FastifyInstance } from "fastify";
import { initORM } from "../../db.js";
import { getUserFromToken, verifyArticlePermission } from "../common/utils.js";
import { wrap } from "@mikro-orm/core";
import { Article } from "./article.entity.js";

export async function registerArticleRoutes(app: FastifyInstance) {
  const db = await initORM();

  app.get("/", async (request) => {
    const { limit, offset } = request.query as {
      limit?: number;
      offset?: number;
    };

    const [items, total] = await db.article.findAndCount({}, { limit, offset });

    return { items, total };
  });

  app.get("/:slug", async (request) => {
    const { slug } = request.params as { slug: string };

    return db.article.findOneOrFail(
      { slug },
      { populate: ["author", "comments.author", "text"] }
    );
  });

  app.post("/:slug/comment", async (request) => {
    const { slug, text } = request.params as { slug: string; text: string };
    const author = getUserFromToken(request);

    const article = await db.article.findOneOrFail({ slug });
    const comment = await db.comment.create({ author, article, text });

    article.comments.add(comment);

    await db.em.flush();

    return comment;
  });

  app.patch("/:id", async (request) => {
    const user = getUserFromToken(request);
    const { id } = request.params as { id: string };
    const article = await db.article.findOneOrFail(+id);

    verifyArticlePermission(user, article);

    wrap(article).assign(request.body as Article);
    await db.em.flush();

    return article;
  });

  app.delete("/:id", async (request) => {
    const user = getUserFromToken(request);
    const { id } = request.params as { id: string };
    const article = await db.article.findOneOrFail(+id);

    if (!article) {
      return { notFound: true };
    }

    verifyArticlePermission(user, article);

    return { success: true };
  });
}
