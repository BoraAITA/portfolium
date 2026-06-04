import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, username: true, bio: true, avatar: true, image: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your public profile</p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
