import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { PostWithAuthor } from "@/types";

type PostCardProps = {
  post: PostWithAuthor;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col">
      {post.coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link href={`/posts/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <Link href={`/${post.author.username}`} className="hover:text-foreground">
            {post.author.name}
          </Link>
          {" · "}
          {formatDate(post.createdAt)}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {post.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
