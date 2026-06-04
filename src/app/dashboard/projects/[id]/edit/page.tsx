import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getProjectById } from "@/server/queries/projects";
import { ProjectEditor } from "@/components/projects/ProjectEditor";
import { updateProject } from "@/server/actions/projects";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const project = await getProjectById(params.id, user.id);
  if (!project) notFound();

  const boundUpdateProject = updateProject.bind(null, project.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
        <p className="text-muted-foreground">{project.title}</p>
      </div>
      <ProjectEditor project={project} action={boundUpdateProject} />
    </div>
  );
}
