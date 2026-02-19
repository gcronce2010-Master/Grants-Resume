import { z } from "zod";

export const basicsSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  location: z.string().min(1, "Location is required."),
  website: z.string().url("Invalid URL.").or(z.literal("")),
  currentRole: z.string().min(1, "Current role is required."),
  company: z.string().min(1, "Company is required."),
  profilePicture: z.string().url("Invalid URL for profile picture.").optional(),
});

export type Basics = z.infer<typeof basicsSchema>;

export const aboutSchema = z.object({
  summary: z.string().min(20, "Please provide a summary of at least 20 characters."),
  aboutParagraph: z.string(),
  shortBio: z.string(),
});

export type About = z.infer<typeof aboutSchema>;

export const experienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required."),
  company: z.string().min(1, "Company is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string(),
  responsibilities: z.tuple([
    z.string().min(1, "Responsibility is required."),
    z.string().min(1, "Responsibility is required."),
    z.string().min(1, "Responsibility is required."),
  ]),
});

export type Experience = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required."),
  degree: z.string().min(1, "Degree is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string(),
});

export type Education = z.infer<typeof educationSchema>;

export const projectEvidenceSchema = z.object({
  type: z.enum(["url", "file"]),
  value: z.string().min(1, "Evidence value is required."),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required."),
  description: z.string().min(1, "Description is required."),
  evidence: z.array(projectEvidenceSchema).min(1, "At least one evidence source is required."),
});

export type Project = z.infer<typeof projectSchema>;

export type ResumeData = {
  basics: Basics;
  about: About;
  experience: Experience[];
  education: Education[];
  projects: Project[];
};
