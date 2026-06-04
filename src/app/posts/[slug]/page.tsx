import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPostBySlug } from "@/server/queries/posts";
import { formatDate } from "@/lib/utils";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const avatarUrl = post.author.avatar || post.author.image;
  const initials =
    post.author.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "A";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        {post.coverImage && (
          <div className="mb-8 aspect-video overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <header className="mb-8 space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/${post.author.username}`}
                className="font-medium hover:text-primary"
              >
                {post.author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content || ""}</ReactMarkdown>
        </div>
      </article>
      <Footer />
    </div>
  );
}
