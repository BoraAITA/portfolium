"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { postSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "./auth";

function parsePostFormData(formData: FormData) {
  const tagsRaw = (formData.get("tags") as string) || "";
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || slugify(formData.get("title") as string),
    content: (formData.get("content") as string) || undefined,
    excerpt: (formData.get("excerpt") as string) || undefined,
    coverImage: (formData.get("coverImage") as string) || "",
    published: formData.get("published") === "true",
    tags,
  };
}

export async function createPost(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const raw = parsePostFormData(formData);
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const existing = await prisma.post.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { success: false, error: "Slug already exists" };
  }

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      coverImage: parsed.data.coverImage || null,
      excerpt: parsed.data.excerpt || null,
      authorId: user.id,
    },
  });

  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");
  redirect(`/dashboard/posts/${post.id}/edit`);
}

export async function updatePost(
  postId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const post = await prisma.post.findFirst({
    where: { id: postId, authorId: user.id },
  });
  if (!post) {
    return { success: false, error: "Post not found" };
  }

  const raw = parsePostFormData(formData);
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  if (parsed.data.slug !== post.slug) {
    const existing = await prisma.post.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return { success: false, error: "Slug already exists" };
    }
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      ...parsed.data,
      coverImage: parsed.data.coverImage || null,
      excerpt: parsed.data.excerpt || null,
    },
  });

  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");
  revalidatePath(`/posts/${parsed.data.slug}`);

  return { success: true };
}

export async function deletePost(postId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const post = await prisma.post.findFirst({
    where: { id: postId, authorId: user.id },
  });
  if (!post) {
    return { success: false, error: "Post not found" };
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");

  return { success: true };
}
