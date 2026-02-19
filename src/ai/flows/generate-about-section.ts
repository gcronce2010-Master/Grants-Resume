'use server';
/**
 * @fileOverview A Genkit flow for generating an 'About' paragraph and a short bio for an online resume.
 *
 * - generateAbout - A function that handles the generation of the about section content.
 * - GenerateAboutInput - The input type for the generateAbout function.
 * - GenerateAboutOutput - The return type for the generateAbout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAboutInputSchema = z.object({
  targetRoles: z.array(z.string()).describe("A list of target roles the user is interested in."),
  strengths: z.array(z.string()).describe("A list of the user's key strengths."),
  industries: z.array(z.string()).describe("A list of industries the user has experience in or is targeting."),
  achievements: z.array(z.string()).describe("A list of the user's notable achievements."),
  tone: z.string().describe("The desired tone for the generated content (e.g., professional, creative, formal)."),
});
export type GenerateAboutInput = z.infer<typeof GenerateAboutInputSchema>;

const GenerateAboutOutputSchema = z.object({
  longAbout: z.string().describe("A professional 'About' paragraph, between 80-120 words in length."),
  shortBio: z.string().describe("A concise short bio, between 1-2 sentences in length."),
});
export type GenerateAboutOutput = z.infer<typeof GenerateAboutOutputSchema>;

export async function generateAbout(input: GenerateAboutInput): Promise<GenerateAboutOutput> {
  return generateAboutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAboutPrompt',
  input: {schema: GenerateAboutInputSchema},
  output: {schema: GenerateAboutOutputSchema},
  prompt: `You are an expert resume writer. Generate a professional 'About' paragraph (80-120 words) and a concise 1-2 sentence short bio for an online resume.

Use the following information as the basis for the generation. Do not invent any new information, especially employers, degrees, or dates. Only rewrite what the user has provided.

- Target Roles: {{{json targetRoles}}}
- Strengths: {{{json strengths}}}
- Industries: {{{json industries}}}
- Achievements: {{{json achievements}}}
- Desired Tone: {{{tone}}}

Ensure the 'longAbout' is between 80-120 words and the 'shortBio' is 1-2 sentences, maintaining the desired tone.
The output must be a valid JSON object matching the provided schema.`,
});

const generateAboutFlow = ai.defineFlow(
  {
    name: 'generateAboutFlow',
    inputSchema: GenerateAboutInputSchema,
    outputSchema: GenerateAboutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
