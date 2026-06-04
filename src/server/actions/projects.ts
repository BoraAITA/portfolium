"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "./auth";

function parseProjectFormData(formData: FormData) {
  const tagsRaw = (formData.get("tags") as string) || "";
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || slugify(formData.get("title") as string),
    description: (formData.get("description") as string) || undefined,
    coverImage: (formData.get("coverImage") as string) || "",
    url: (formData.get("url") as string) || "",
    github: (formData.get("github") as string) || "",
    tags,
    featured: formData.get("featured") === "true",
    order: parseInt((formData.get("order") as string) || "0", 10),
  };
}

export async function createProject(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const raw = parseProjectFormData(formData);
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const existing = await prisma.project.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { success: false, error: "Slug already exists" };
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      coverImage: parsed.data.coverImage || null,
      description: parsed.data.description || null,
      url: parsed.data.url || null,
      github: parsed.data.github || null,
      authorId: user.id,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  if (user.username) revalidatePath(`/${user.username}`);
  redirect(`/dashboard/projects/${project.id}/edit`);
}

export async function updateProject(
  projectId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, authorId: user.id },
  });
  if (!project) {
    return { success: false, error: "Project not found" };
  }

  const raw = parseProjectFormData(formData);
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  if (parsed.data.slug !== project.slug) {
    const existing = await prisma.project.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return { success: false, error: "Slug already exists" };
    }
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      ...parsed.data,
      coverImage: parsed.data.coverImage || null,
      description: parsed.data.description || null,
      url: parsed.data.url || null,
      github: parsed.data.github || null,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  if (user.username) revalidatePath(`/${user.username}`);

  return { success: true };
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, authorId: user.id },
  });
  if (!project) {
    return { success: false, error: "Project not found" };
  }

  await prisma.project.delete({ where: { id: projectId } });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  if (user.username) revalidatePath(`/${user.username}`);

  return { success: true };
}
