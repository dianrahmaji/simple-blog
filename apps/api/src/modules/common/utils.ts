import { FastifyRequest } from "fastify";
import { Article } from "../article/article.entity.js";
import { User } from "../user/user.entity.js";

export function getUserFromToken(req: FastifyRequest): User {
  if (!req.user) {
    throw new Error("Please provide your token via Authorization header");
  }

  return req.user as User;
}

export function verifyArticlePermission(user: User, article: Article): void {
  if (article.author.id !== user.id) {
    throw new Error("You are not the author if this article!");
  }
}

export class AuthError extends Error {}
