'use server';
/**
 * @fileOverview A Genkit flow for generating an 'About' paragraph and a short bio for an online resume.
 *
 * - generateAboutSection - A function that handles the generation of the about section content.
 * - GenerateAboutSectionInput - The input type for the generateAboutSection function.
 * - GenerateAboutSectionOutput - The return type for the generateAboutSection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAboutSectionInputSchema = z.object({
  profileDetails:
    z.string()
      .describe(
        'A comprehensive summary of the user\'s profile details, including name, current role, company, years of experience, key skills, career summary, and education.'
      ),
});
export type GenerateAboutSectionInput = z.infer<typeof GenerateAboutSectionInputSchema>;

const GenerateAboutSectionOutputSchema = z.object({
  aboutParagraph:
    z.string()
      .describe('A professional \'About\' paragraph, between 80-120 words in length.'),
  shortBio:
    z.string()
      .describe('A concise short bio, between 1-2 sentences in length.'),
});
export type GenerateAboutSectionOutput = z.infer<typeof GenerateAboutSectionOutputSchema>;

export async function generateAboutSection(input: GenerateAboutSectionInput):
  Promise<GenerateAboutSectionOutput> {
  return generateAboutSectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAboutSectionPrompt',
  input: {schema: GenerateAboutSectionInputSchema},
  output: {schema: GenerateAboutSectionOutputSchema},
  prompt: `Generate a professional 'About' paragraph (80-120 words) and a concise 1-2 sentence short bio for an online resume.

Use the following profile details as the basis for the generation:

Profile Details: {{{profileDetails}}}

Ensure the 'About' paragraph is between 80-120 words and the 'shortBio' is 1-2 sentences, maintaining a professional tone.`,
});

const generateAboutSectionFlow = ai.defineFlow(
  {
    name: 'generateAboutSectionFlow',
    inputSchema: GenerateAboutSectionInputSchema,
    outputSchema: GenerateAboutSectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
