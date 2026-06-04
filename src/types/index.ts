import type { Post, Project, User } from "@prisma/client";

export type UserPublic = Pick<
  User,
  "id" | "name" | "username" | "bio" | "avatar" | "image" | "theme"
>;

export type PostWithAuthor = Post & {
  author: Pick<User, "id" | "name" | "username" | "avatar" | "image">;
};

export type ProjectWithAuthor = Project & {
  author: Pick<User, "id" | "name" | "username" | "avatar" | "image">;
};

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
};
