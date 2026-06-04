import { prisma } from "@/lib/prisma";

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
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

export async function getUserProjects(userId: string) {
  return prisma.project.findMany({
    where: { authorId: userId },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getProjectById(id: string, userId: string) {
  return prisma.project.findFirst({
    where: { id, authorId: userId },
  });
}
