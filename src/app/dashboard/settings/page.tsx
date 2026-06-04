import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/profile/SettingsForm";

export default async function SettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { theme: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>
      <SettingsForm theme={user.theme as "dark" | "light"} />
    </div>
  );
}
