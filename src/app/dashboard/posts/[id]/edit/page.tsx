import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getPostById } from "@/server/queries/posts";
import { PostEditor } from "@/components/posts/PostEditor";
import { updatePost } from "@/server/actions/posts";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const post = await getPostById(params.id, user.id);
  if (!post) notFound();

  const boundUpdatePost = updatePost.bind(null, post.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
        <p className="text-muted-foreground">{post.title}</p>
      </div>
      <PostEditor post={post} action={boundUpdatePost} />
    </div>
  );
}
