"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useFormStatus } from "react";
import { useEffect } from "react";
import { useResume } from "@/context/ResumeContext";
import { aboutSchema, type About } from "@/lib/types";
import { generateAboutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { Input } from "../ui/input";

const initialState = {
  status: 'idle' as const,
  message: '',
  data: null,
};

function GenerationButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="secondary">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Generate with AI
    </Button>
  );
}

export default function AboutForm() {
  const { resumeData, setResumeData } = useResume();
  const { toast } = useToast();
  const [state, formAction] = useActionState(generateAboutAction, initialState);

  const form = useForm<About>({
    resolver: zodResolver(aboutSchema),
    defaultValues: resumeData.about,
  });

  useEffect(() => {
    if (state.status === 'success' && state.data) {
      form.setValue('aboutParagraph', state.data.longAbout);
      form.setValue('shortBio', state.data.shortBio);
      toast({
        title: "Content Generated!",
        description: "Your 'About' and 'Bio' sections have been populated.",
      });
    } else if (state.status === 'error') {
      toast({
        title: "Generation Failed",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, form, toast]);

  const onSave = (data: About) => {
    setResumeData((prev) => ({ ...prev, about: data }));
    toast({
      title: "Success!",
      description: "Your 'About' section has been updated.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>AI Content Generation</CardTitle>
          <CardDescription>
            Provide some details to have AI craft a professional 'About' section and a short bio for you.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="targetRoles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Roles</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Product Manager, UX Lead" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Strengths</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Prototyping, User Research" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industries</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SaaS, Healthcare, E-commerce" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Achievements</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Increased conversion by 15%..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Professional, Creative" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {state.status === 'error' && <p className="text-sm font-medium text-destructive">{state.message}</p>}
          </CardContent>
          <CardFooter>
            <GenerationButton />
          </CardFooter>
        </form>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your 'About' Section</CardTitle>
              <CardDescription>
                This content will be displayed on your resume. You can edit the generated text.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="shortBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Bio (1-2 sentences)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A concise bio for your resume header." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutParagraph"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Paragraph (80-120 words)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A detailed paragraph about your professional self."
                        className="h-48"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
