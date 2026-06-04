import { PostEditor } from "@/components/posts/PostEditor";
import { createPost } from "@/server/actions/posts";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New post</h1>
        <p className="text-muted-foreground">Write a new blog post</p>
      </div>
      <PostEditor action={createPost} />
    </div>
  );
}
