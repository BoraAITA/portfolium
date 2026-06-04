import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const demo = await prisma.user.upsert({
    where: { email: "demo@portfolium.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@portfolium.app",
      username: "demo",
      password,
      bio: "Full-stack developer building minimal tools for creators.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      theme: "dark",
    },
  });

  await prisma.post.upsert({
    where: { slug: "welcome-to-portfolium" },
    update: {},
    create: {
      title: "Welcome to Portfolium",
      slug: "welcome-to-portfolium",
      content: `# Welcome to Portfolium

This is your **minimal** portfolio and blog platform.

## Features

- User profiles with custom URLs
- Markdown blog posts
- Portfolio project showcase
- Dark and light themes

Start building your presence today!`,
      excerpt: "Get started with your portfolio and blog on Portfolium.",
      published: true,
      tags: ["welcome", "getting-started"],
      authorId: demo.id,
    },
  });

  await prisma.project.upsert({
    where: { slug: "portfolium-app" },
    update: {},
    create: {
      title: "Portfolium",
      slug: "portfolium-app",
      description: "A minimal portfolio and blog platform built with Next.js 14.",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      url: "https://github.com",
      github: "https://github.com",
      tags: ["Next.js", "TypeScript", "Prisma"],
      featured: true,
      order: 0,
      authorId: demo.id,
    },
  });

  console.log("Seed completed:", { demo: demo.username });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
