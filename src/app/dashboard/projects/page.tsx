import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getUserProjects } from "@/server/queries/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";

export default async function DashboardProjectsPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const projects = await getUserProjects(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">New project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">
          No projects yet. Add your first project.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-lg border p-4">
              {project.coverImage && (
                <div className="mb-3 aspect-video overflow-hidden rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium">{project.title}</h3>
                {project.featured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Order: {project.order}
              </p>
              <div className="mt-3 flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/projects/${project.id}/edit`}>
                    Edit
                  </Link>
                </Button>
                <DeleteProjectButton projectId={project.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
