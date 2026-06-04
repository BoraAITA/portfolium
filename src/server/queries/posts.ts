import { prisma } from "@/lib/prisma";

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          image: true,
        },
      },
    },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, published: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          image: true,
        },
      },
    },
  });
}

export async function getUserPosts(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostById(id: string, userId: string) {
  return prisma.post.findFirst({
    where: { id, authorId: userId },
  });
}
