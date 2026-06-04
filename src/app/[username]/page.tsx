import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { getUserProfileData } from "@/server/queries/users";
import { formatDate } from "@/lib/utils";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const data = await getUserProfileData(params.username);
  if (!data) notFound();

  const { user, projects, posts } = data;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <ProfileHeader user={user} />

        {projects.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">Recent posts</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="block rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <h3 className="font-medium">{post.title}</h3>
                  {post.excerpt && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </span>
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {projects.length === 0 && posts.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            No projects or posts yet.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
