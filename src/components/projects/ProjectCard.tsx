import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@prisma/client";

type ProjectCardProps = {
  project: Project & {
    author?: { name: string | null; username: string };
  };
  showAuthor?: boolean;
};

export function ProjectCard({ project, showAuthor = false }: ProjectCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      {project.coverImage && (
        <div className="aspect-video w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        {showAuthor && project.author && (
          <Link
            href={`/${project.author.username}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {project.author.name}
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {project.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        )}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto flex gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Visit
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub →
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
