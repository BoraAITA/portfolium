import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getFeaturedProjects } from "@/server/queries/projects";

export default async function ProjectsPage() {
  const projects = await getFeaturedProjects();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Featured portfolio projects from creators
          </p>
        </div>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No featured projects yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} showAuthor />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
