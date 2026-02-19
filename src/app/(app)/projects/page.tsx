"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { PlusCircle } from "lucide-react";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const { resumeData } = useResume();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const handleAddNew = () => {
    setEditingProject(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {resumeData.projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumeData.projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={() => handleEdit(project)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold text-muted-foreground">No projects yet.</h2>
          <p className="text-muted-foreground mt-2">Add your first project to showcase your work.</p>
          <Button onClick={handleAddNew} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
        </Button>
        </div>
      )}

      <ProjectDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        project={editingProject}
      />
    </div>
  );
}
