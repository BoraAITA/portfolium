import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Username must be lowercase letters, numbers, hyphens, or underscores"
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Invalid username format"),
  bio: z.string().max(500).optional(),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200),
  content: z.string().optional(),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean(),
  tags: z.array(z.string()),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  url: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()),
  featured: z.boolean(),
  order: z.number().int().min(0),
});

export const settingsSchema = z.object({
  theme: z.enum(["dark", "light"]),
});
