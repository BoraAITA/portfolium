import { ProjectEditor } from "@/components/projects/ProjectEditor";
import { createProject } from "@/server/actions/projects";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
        <p className="text-muted-foreground">Add a portfolio project</p>
      </div>
      <ProjectEditor action={createProject} />
    </div>
  );
}
