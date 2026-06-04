"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import type { Project } from "@prisma/client";
import type { ActionResult } from "@/server/actions/auth";

type ProjectEditorProps = {
  project?: Project;
  action: (
    prevState: ActionResult,
    formData: FormData
  ) => Promise<ActionResult>;
};

export function ProjectEditor({ project, action }: ProjectEditorProps) {
  const [state, formAction] = useFormState(action, {
    success: false,
  });
  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [slugEdited, setSlugEdited] = useState(!!project);

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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          defaultValue={project?.coverImage || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Project URL</Label>
        <Input id="url" name="url" type="url" defaultValue={project?.url || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          name="github"
          type="url"
          defaultValue={project?.github || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={project?.tags.join(", ") || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Display order</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min={0}
          defaultValue={project?.order ?? 0}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={project?.featured}
            className="h-4 w-4 rounded border-input"
          />
          Featured on profile
        </label>
      </div>

      <Button type="submit">
        {project ? "Save changes" : "Create project"}
      </Button>
    </form>
  );
}
