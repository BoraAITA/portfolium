"use client";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "@/server/actions/profile";
import type { User } from "@prisma/client";

type ProfileFormProps = {
  user: Pick<User, "name" | "username" | "bio" | "avatar" | "image">;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfile, {
    success: false,
  });

  const avatarUrl = user.avatar || user.image;
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <form action={formAction} className="max-w-lg space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md bg-primary/10 px-4 py-2 text-sm text-primary">
          Profile updated
        </p>
      )}

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">
          Avatar preview updates after save
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={user.name || ""} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          defaultValue={user.username}
          required
          pattern="[a-z0-9_-]+"
        />
        <p className="text-xs text-muted-foreground">
          Lowercase letters, numbers, hyphens, underscores only
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={user.bio || ""} rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input
          id="avatar"
          name="avatar"
          type="url"
          defaultValue={user.avatar || ""}
        />
      </div>

      <Button type="submit">
        Save profile
      </Button>
    </form>
  );
}
