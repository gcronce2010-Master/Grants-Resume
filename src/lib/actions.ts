'use server';

import { generateAboutSection, type GenerateAboutSectionOutput } from '@/ai/flows/generate-about-section';
import { z } from 'zod';

const aboutActionSchema = z.object({
  profileDetails: z.string().min(20, "Please provide a summary of at least 20 characters."),
});

type AboutActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  data: GenerateAboutSectionOutput | null;
}

export async function generateAboutAction(
  prevState: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  
  const validatedFields = aboutActionSchema.safeParse({
    profileDetails: formData.get('profileDetails'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.flatten().fieldErrors.profileDetails?.[0] || "Validation failed.",
      data: null,
    };
  }

  try {
    const output = await generateAboutSection({ profileDetails: validatedFields.data.profileDetails });
    return {
      status: 'success',
      message: 'Content generated successfully.',
      data: output,
    }
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'An error occurred while generating content. Please try again.',
      data: null,
    }
  }
}
