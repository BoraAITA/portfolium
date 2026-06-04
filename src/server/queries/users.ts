import { prisma } from "@/lib/prisma";

const RESERVED_USERNAMES = [
  "login",
  "register",
  "dashboard",
  "posts",
  "projects",
  "auth",
  "api",
  "settings",
];

export async function getUserByUsername(username: string) {
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return null;
  }

  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatar: true,
      image: true,
      theme: true,
      createdAt: true,
    },
  });
}

export async function getFeaturedUsers(limit = 6) {
  return prisma.user.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatar: true,
      image: true,
    },
  });
}

export async function getUserProfileData(username: string) {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const [projects, posts] = await Promise.all([
    prisma.project.findMany({
      where: { authorId: user.id, featured: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.post.findMany({
      where: { authorId: user.id, published: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        createdAt: true,
      },
    }),
  ]);

  return { user, projects, posts };
}
