import Link from "next/link";
import { FileText, FolderKanban, User } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const [postsCount, projectsCount, publishedCount] = await Promise.all([
    prisma.post.count({ where: { authorId: user.id } }),
    prisma.project.count({ where: { authorId: user.id } }),
    prisma.post.count({ where: { authorId: user.id, published: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user.name ? `, ${user.name}` : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{postsCount}</p>
            <p className="text-xs text-muted-foreground">
              {publishedCount} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{projectsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${user.username}`}>View public profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/posts/new"
          className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent"
        >
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-medium">New post</span>
        </Link>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent"
        >
          <FolderKanban className="h-5 w-5 text-primary" />
          <span className="font-medium">New project</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent"
        >
          <User className="h-5 w-5 text-primary" />
          <span className="font-medium">Edit profile</span>
        </Link>
      </div>
    </div>
  );
}
