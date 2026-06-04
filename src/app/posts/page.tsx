import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/posts/PostCard";
import { getPublishedPosts } from "@/server/queries/posts";

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Latest posts from the community
          </p>
        </div>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No published posts yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
