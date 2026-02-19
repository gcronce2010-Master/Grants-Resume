'use server';
/**
 * @fileOverview A Genkit flow for building a project summary from evidence.
 *
 * - buildProjectFromEvidence - A function that creates a project summary.
 * - BuildProjectFromEvidenceInput - The input type for the function.
 * - BuildProjectFromEvidenceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuildProjectFromEvidenceInputSchema = z.object({
  projectName: z.string().describe("The name of the project."),
  role: z.string().describe("The user's role in the project."),
  techStack: z.array(z.string()).describe("The technologies used in the project."),
  evidenceTextOrUrlSummary: z.string().describe("A summary of evidence, which could be text from a file or a summary of a URL."),
});
export type BuildProjectFromEvidenceInput = z.infer<typeof BuildProjectFromEvidenceInputSchema>;

const BuildProjectFromEvidenceOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the project."),
  bullets: z.array(z.string()).length(3).describe("An array of exactly 3 bullet points highlighting key aspects of the project."),
});
export type BuildProjectFromEvidenceOutput = z.infer<typeof BuildProjectFromEvidenceOutputSchema>;

export async function buildProjectFromEvidence(input: BuildProjectFromEvidenceInput): Promise<BuildProjectFromEvidenceOutput> {
  return buildProjectFromEvidenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildProjectFromEvidencePrompt',
  input: {schema: BuildProjectFromEvidenceInputSchema},
  output: {schema: BuildProjectFromEvidenceOutputSchema},
  prompt: `You are an expert project manager and resume writer. Based on the provided evidence, create a project summary and 3 impactful bullet points for a resume.

Do not invent information. Stick to the details given.

- Project Name: {{{projectName}}}
- My Role: {{{role}}}
- Technology Stack: {{{json techStack}}}
- Evidence Summary: {{{evidenceTextOrUrlSummary}}}

Generate a project 'summary' and exactly 3 'bullets' that describe the project's goals, the user's contributions, and the outcomes.
The output must be a valid JSON object.`,
});

const buildProjectFromEvidenceFlow = ai.defineFlow(
  {
    name: 'buildProjectFromEvidenceFlow',
    inputSchema: BuildProjectFromEvidenceInputSchema,
    outputSchema: BuildProjectFromEvidenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
