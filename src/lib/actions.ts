'use server';

import { generateAbout, type GenerateAboutOutput } from '@/ai/flows/generate-about-section';
import { buildProjectFromEvidence, type BuildProjectFromEvidenceOutput } from '@/ai/flows/build-project-from-evidence-flow';
import { rewriteResponsibilities, type RewriteResponsibilitiesOutput } from '@/ai/flows/rewrite-responsibilities-flow';
import { z } from 'zod';

const generateAboutActionSchema = z.object({
  targetRoles: z.string().min(1, "Please provide at least one target role."),
  strengths: z.string().min(1, "Please provide your strengths."),
  industries: z.string().min(1, "Please provide industries."),
  achievements: z.string().min(1, "Please provide your achievements."),
  tone: z.string().min(1, "Please select a tone."),
});


type GenerateAboutActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  data: { longAbout: string, shortBio: string } | null;
}

export async function generateAboutAction(
  prevState: GenerateAboutActionState,
  formData: FormData
): Promise<GenerateAboutActionState> {
  
  const validatedFields = generateAboutActionSchema.safeParse({
    targetRoles: formData.get('targetRoles'),
    strengths: formData.get('strengths'),
    industries: formData.get('industries'),
    achievements: formData.get('achievements'),
    tone: formData.get('tone'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      status: 'error',
      message: firstError || "Validation failed.",
      data: null,
    };
  }

  try {
    const input = {
      targetRoles: validatedFields.data.targetRoles.split(',').map(s => s.trim()),
      strengths: validatedFields.data.strengths.split(',').map(s => s.trim()),
      industries: validatedFields.data.industries.split(',').map(s => s.trim()),
      achievements: validatedFields.data.achievements.split(',').map(s => s.trim()),
      tone: validatedFields.data.tone,
    };
    const output = await generateAbout(input);
    return {
      status: 'success',
      message: 'Content generated successfully.',
      data: { longAbout: output.longAbout, shortBio: output.shortBio },
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      status: 'error',
      message: `An error occurred while generating content: ${errorMessage}`,
      data: null,
    }
  }
}

const rewriteResponsibilitiesActionSchema = z.object({
  rawBullets: z.string(),
  jobTitle: z.string().min(1, "Job title is required."),
  company: z.string().min(1, "Company is required."),
  targetRole: z.string().min(1, "Target role is required."),
  index: z.string(),
});

type RewriteResponsibilitiesActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  data: RewriteResponsibilitiesOutput | null;
  index?: number;
}

export async function rewriteResponsibilitiesAction(
  prevState: RewriteResponsibilitiesActionState,
  formData: FormData
): Promise<RewriteResponsibilitiesActionState> {
  const validatedFields = rewriteResponsibilitiesActionSchema.safeParse({
    rawBullets: formData.get('rawBullets'),
    jobTitle: formData.get('jobTitle'),
    company: formData.get('company'),
    targetRole: formData.get('targetRole'),
    index: formData.get('index'),
  });

  if (!validatedFields.success) {
    return { status: 'error', message: "Validation failed.", data: null };
  }

  const rawBullets = validatedFields.data.rawBullets.split('\n').map(s => s.trim()).filter(s => s);
  if (rawBullets.length === 0) {
    return { status: 'error', message: 'Please provide at least one responsibility to rewrite.', data: null, index: parseInt(validatedFields.data.index, 10) };
  }

  try {
    const input = {
      rawBullets,
      jobTitle: validatedFields.data.jobTitle,
      company: validatedFields.data.company,
      targetRole: validatedFields.data.targetRole,
    };
    const output = await rewriteResponsibilities(input);
    return {
      status: 'success',
      message: 'Responsibilities rewritten.',
      data: output,
      index: parseInt(validatedFields.data.index, 10),
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'AI rewrite failed.', data: null, index: parseInt(validatedFields.data.index, 10) };
  }
}

const buildProjectFromEvidenceActionSchema = z.object({
  projectName: z.string().min(1, "Project name is required."),
  role: z.string().min(1, "Your role is required."),
  techStack: z.string().min(1, "Tech stack is required."),
  evidenceSummary: z.string().min(1, "Evidence summary is required."),
});

type BuildProjectFromEvidenceActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  data: BuildProjectFromEvidenceOutput | null;
}

export async function buildProjectFromEvidenceAction(
  prevState: BuildProjectFromEvidenceActionState,
  formData: FormData
): Promise<BuildProjectFromEvidenceActionState> {
    const validatedFields = buildProjectFromEvidenceActionSchema.safeParse({
        projectName: formData.get('projectName'),
        role: formData.get('role'),
        techStack: formData.get('techStack'),
        evidenceSummary: formData.get('evidenceSummary'),
    });

    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        return { status: 'error', message: firstError || "Validation failed.", data: null };
    }

    try {
        const input = {
            projectName: validatedFields.data.projectName,
            role: validatedFields.data.role,
            techStack: validatedFields.data.techStack.split(',').map(s => s.trim()),
            evidenceTextOrUrlSummary: validatedFields.data.evidenceSummary,
        };
        const output = await buildProjectFromEvidence(input);
        return {
            status: 'success',
            message: 'Project summary generated.',
            data: output,
        }
    } catch (error) {
        console.error(error);
        return { status: 'error', message: 'AI generation failed.', data: null };
    }
}
