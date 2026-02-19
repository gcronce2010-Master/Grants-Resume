"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "@/context/ResumeContext";
import { projectSchema, type Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface ProjectDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  project?: Project;
}

export function ProjectDialog({ isOpen, setIsOpen, project }: ProjectDialogProps) {
  const { resumeData, setResumeData } = useResume();
  const { toast } = useToast();

  const form = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      evidence: [],
    },
  });

  useEffect(() => {
    form.reset(project || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      evidence: [],
    });
  }, [project, isOpen, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "evidence",
  });

  const onSubmit = (data: Project) => {
    setResumeData((prev) => {
      const existingProjectIndex = prev.projects.findIndex((p) => p.id === data.id);
      if (existingProjectIndex > -1) {
        const updatedProjects = [...prev.projects];
        updatedProjects[existingProjectIndex] = data;
        return { ...prev, projects: updatedProjects };
      }
      return { ...prev, projects: [...prev.projects, data] };
    });
    toast({
      title: "Success!",
      description: `Project "${data.title}" has been ${project ? 'updated' : 'added'}.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            Showcase your work by adding a project to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl><Input placeholder="e.g., E-commerce Redesign" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="A brief summary of the project, your role, and the outcome." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Evidence (at least 1 required)</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <FormField control={form.control} name={`evidence.${index}.type`} render={({ field }) => (
                        <FormItem className="w-1/3">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="url">URL</SelectItem>
                              <SelectItem value="file">File Upload</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                     <FormField control={form.control} name={`evidence.${index}.value`} render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            {form.getValues(`evidence.${index}.type`) === 'file' ? (
                                <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0]?.name || '')} />
                            ) : (
                                <Input placeholder="https://example.com" {...field} />
                            )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ type: 'url', value: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Evidence
              </Button>
              <FormMessage>{form.formState.errors.evidence?.root?.message}</FormMessage>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {project ? "Save Changes" : "Add Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
