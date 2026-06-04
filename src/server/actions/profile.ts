"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { profileSchema, settingsSchema } from "@/lib/validations";
import type { ActionResult } from "./auth";

export async function updateProfile(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const raw = {
    name: formData.get("name") as string,
    username: (formData.get("username") as string)?.toLowerCase(),
    bio: (formData.get("bio") as string) || undefined,
    avatar: (formData.get("avatar") as string) || "",
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { name, username, bio, avatar } = parsed.data;

  if (username !== user.username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== user.id) {
      return { success: false, error: "Username already taken" };
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      username,
      bio: bio || null,
      avatar: avatar || null,
    },
  });

  revalidatePath(`/${username}`);
  revalidatePath("/dashboard/profile");

  return { success: true };
}

export async function updateTheme(theme: "dark" | "light"): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = settingsSchema.safeParse({ theme });
  if (!parsed.success) {
    return { success: false, error: "Invalid theme" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { theme: parsed.data.theme },
  });

  return { success: true };
}
