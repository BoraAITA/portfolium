import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import type { UserPublic } from "@/types";

type ProfileHeaderProps = {
  user: UserPublic;
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const avatarUrl = user.avatar || user.image;
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} alt={user.name || user.username} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {user.name || user.username}
            </h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <ThemeToggle />
        </div>
        {user.bio && (
          <p className="max-w-xl text-muted-foreground">{user.bio}</p>
        )}
      </div>
    </div>
  );
}
