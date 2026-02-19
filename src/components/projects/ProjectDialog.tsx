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
import { Loader2, PlusCircle, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { buildProjectFromEvidenceAction } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ProjectDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  project?: Project;
}

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate with AI
    </Button>
  );
}

export function ProjectDialog({ isOpen, setIsOpen, project }: ProjectDialogProps) {
  const { setResumeData } = useResume();
  const { toast } = useToast();
  
  const [generateState, generateAction] = useActionState(buildProjectFromEvidenceAction, { status: 'idle', message: '', data: null });

  const form = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      evidence: [],
      role: "",
      techStack: "",
      bullets: [],
      evidenceSummary: "",
    },
  });

  useEffect(() => {
    if (generateState.status === 'success' && generateState.data) {
        form.setValue('description', generateState.data.summary);
        form.setValue('bullets', generateState.data.bullets);
        toast({ title: "Success!", description: "Project summary generated." });
    } else if (generateState.status === 'error') {
        toast({ title: "Generation Failed", description: generateState.message, variant: "destructive" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateState, toast]);

  useEffect(() => {
    form.reset(project || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      evidence: [],
      role: "",
      techStack: "",
      bullets: [],
      evidenceSummary: "",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isOpen]);

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
      <DialogContent className="sm:max-w-4xl grid-cols-1 md:grid-cols-3 grid">
        <div className="md:col-span-2">
            <DialogHeader>
              <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                Showcase your work by adding a project to your portfolio.
              </DialogDescription>
            </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl><Input placeholder="e.g., E-commerce Redesign" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role</FormLabel>
                    <FormControl><Input placeholder="e.g., Lead Developer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                <FormField control={form.control} name="techStack" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack</FormLabel>
                    <FormControl><Input placeholder="e.g., React, Next.js, Firebase" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              </div>
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
                <div className="space-y-2 mt-2">
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
        </div>
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI Generation</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form action={generateAction} className="h-full flex flex-col">
                <CardContent className="flex-grow">
                  <input type="hidden" name="projectName" value={form.watch('title')} />
                  <input type="hidden" name="role" value={form.watch('role')} />
                  <input type="hidden" name="techStack" value={form.watch('techStack')} />
                  <FormField
                    control={form.control}
                    name="evidenceSummary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evidence Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a summary of a URL or paste text from a document to generate a project description and highlights."
                            className="h-48"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {generateState.status === 'error' && <p className="text-sm font-medium text-destructive">{generateState.message}</p>}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                  <GenerateButton />
                </DialogFooter>
              </form>
            </Form>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
