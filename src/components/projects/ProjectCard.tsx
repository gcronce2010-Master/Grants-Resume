"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/lib/types";
import { Edit, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          {project.title}
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Separator className="my-2" />
        <h4 className="text-sm font-semibold mb-2 text-foreground">Evidence</h4>
        <div className="space-y-2">
          {project.evidence.map((e, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              {e.type === 'url' ? <ExternalLink className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              {e.type === 'url' ? (
                 <Link href={e.value} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline-offset-4 hover:underline truncate">
                    {e.value}
                 </Link>
              ) : (
                <span className="truncate">{e.value}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
