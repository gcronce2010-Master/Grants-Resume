"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResume } from "@/context/ResumeContext";
import { experienceSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Sparkles, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { rewriteResponsibilitiesAction } from "@/lib/actions";

const formSchema = z.object({
  experience: z.array(experienceSchema),
});

function RewriteButton({ onClick, isPending }: { onClick: () => void; isPending: boolean; }) {
  return (
    <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={onClick}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Rewrite with AI
    </Button>
  );
}

export default function ExperienceForm() {
  const { resumeData, setResumeData } = useResume();
  const { toast } = useToast();
  const [pendingRewrite, setPendingRewrite] = useState<number | null>(null);
  
  const [rewriteState, rewriteAction] = useActionState(rewriteResponsibilitiesAction, { status: 'idle', message: '', data: null });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience: resumeData.experience,
    },
  });

  useEffect(() => {
    if (rewriteState.status === 'success' || rewriteState.status === 'error') {
      setPendingRewrite(null);
    }
    if (rewriteState.status === 'success' && rewriteState.data && rewriteState.index !== undefined) {
      form.setValue(`experience.${rewriteState.index}.responsibilities`, rewriteState.data.bullets as [string, string, string]);
      toast({ title: "Success!", description: "Responsibilities rewritten." });
    } else if (rewriteState.status === 'error') {
      toast({ title: "Rewrite Failed", description: rewriteState.message, variant: "destructive" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewriteState, toast, form]);
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setResumeData((prev) => ({ ...prev, experience: data.experience }));
    toast({
      title: "Success!",
      description: "Your experience section has been updated.",
    });
  };
  
  const handleRewrite = (index: number) => {
    setPendingRewrite(index);
    const formData = new FormData();
    formData.set('rawBullets', form.getValues(`experience.${index}.responsibilities`).join('\n'));
    formData.set('jobTitle', form.getValues(`experience.${index}.role`));
    formData.set('company', form.getValues(`experience.${index}.company`));
    formData.set('targetRole', resumeData.basics.currentRole);
    formData.set('index', String(index));
    rewriteAction(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>List your previous and current job roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl><Input placeholder="Software Engineer" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl><Input placeholder="e.g., Jan 2020" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl><Input placeholder="e.g., Present or Dec 2022" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>Responsibilities (exactly 3 required)</FormLabel>
                    <RewriteButton isPending={pendingRewrite === index} onClick={() => handleRewrite(index)} />
                  </div>
                   <div className="space-y-2 mt-2">
                    {[0, 1, 2].map((respIndex) => (
                       <FormField
                          key={respIndex}
                          control={form.control}
                          name={`experience.${index}.responsibilities.${respIndex}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl><Input placeholder={`Responsibility #${respIndex + 1}`} {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    ))}
                   </div>
                   {rewriteState.status === 'error' && rewriteState.index === index && <p className="text-sm font-medium text-destructive">{rewriteState.message}</p>}
                </div>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ id: crypto.randomUUID(), role: '', company: '', startDate: '', endDate: '', responsibilities: ['', '', ''] })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Experience
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
