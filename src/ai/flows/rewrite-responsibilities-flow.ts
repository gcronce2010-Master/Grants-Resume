'use server';
/**
 * @fileOverview A Genkit flow for rewriting job responsibilities.
 *
 * - rewriteResponsibilities - A function that rewrites job responsibilities.
 * - RewriteResponsibilitiesInput - The input type for the rewriteResponsibilities function.
 * - RewriteResponsibilitiesOutput - The return type for the rewriteResponsibilities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteResponsibilitiesInputSchema = z.object({
  rawBullets: z.array(z.string()).describe("An array of raw, user-provided responsibility bullet points."),
  jobTitle: z.string().describe("The user's job title for this role."),
  company: z.string().describe("The company where the user held this role."),
  targetRole: z.string().describe("The target role the user is applying for, to tailor the responsibilities."),
});
export type RewriteResponsibilitiesInput = z.infer<typeof RewriteResponsibilitiesInputSchema>;

const RewriteResponsibilitiesOutputSchema = z.object({
  bullets: z.array(z.string()).length(3).describe("An array containing exactly 3 rewritten, professional responsibility bullet points."),
});
export type RewriteResponsibilitiesOutput = z.infer<typeof RewriteResponsibilitiesOutputSchema>;

export async function rewriteResponsibilities(input: RewriteResponsibilitiesInput): Promise<RewriteResponsibilitiesOutput> {
  return rewriteResponsibilitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteResponsibilitiesPrompt',
  input: {schema: RewriteResponsibilitiesInputSchema},
  output: {schema: RewriteResponsibilitiesOutputSchema},
  prompt: `You are an expert resume writer. Your task is to rewrite a list of job responsibilities to be more impactful and tailored for a specific target role.

You must return exactly 3 bullet points. Do not invent facts, employers, degrees, or dates. Base your response strictly on the information provided.

- Job Title: {{{jobTitle}}}
- Company: {{{company}}}
- Raw Responsibilities: {{{json rawBullets}}}
- Target Role for Tailoring: {{{targetRole}}}

Rewrite the provided responsibilities into exactly 3 concise, action-oriented bullet points that highlight achievements and skills relevant to the target role.
The output must be a valid JSON object with a 'bullets' key containing an array of 3 strings.`,
});

const rewriteResponsibilitiesFlow = ai.defineFlow(
  {
    name: 'rewriteResponsibilitiesFlow',
    inputSchema: RewriteResponsibilitiesInputSchema,
    outputSchema: RewriteResponsibilitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
