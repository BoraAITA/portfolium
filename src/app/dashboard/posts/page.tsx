import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getUserPosts } from "@/server/queries/posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeletePostButton } from "@/components/posts/DeletePostButton";
import { formatDate } from "@/lib/utils";

export default async function DashboardPostsPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const posts = await getUserPosts(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posts/new">New post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Create your first post.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{post.title}</h3>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.createdAt)} · /posts/{post.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/posts/${post.id}/edit`}>Edit</Link>
                </Button>
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
