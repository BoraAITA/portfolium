"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import type { Post } from "@prisma/client";
import type { ActionResult } from "@/server/actions/auth";

type PostEditorProps = {
  post?: Post;
  action: (
    prevState: ActionResult,
    formData: FormData
  ) => Promise<ActionResult>;
};

export function PostEditor({ post, action }: PostEditorProps) {
  const [state, formAction] = useFormState(action, {
    success: false,
  });
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugEdited, setSlugEdited] = useState(!!post);

  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md bg-primary/10 px-4 py-2 text-sm text-primary">
          Saved successfully
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugEdited(true);
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={post?.content || ""}
          className="min-h-[300px] font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={post?.tags.join(", ") || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          defaultValue={post?.coverImage || ""}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={post?.published}
            className="h-4 w-4 rounded border-input"
          />
          Published
        </label>
      </div>

      <Button type="submit">
        {post ? "Save changes" : "Create post"}
      </Button>
    </form>
  );
}
