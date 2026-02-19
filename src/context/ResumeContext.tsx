"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ResumeData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const profilePicPlaceholder = PlaceHolderImages.find(img => img.id === 'profile-picture');

const initialResumeData: ResumeData = {
  basics: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    location: 'New York, NY',
    website: 'https://janedoe.dev',
    currentRole: 'Lead Product Designer',
    company: 'Innovate Inc.',
    profilePicture: profilePicPlaceholder?.imageUrl || ''
  },
  about: {
    summary: 'I am a lead product designer at Innovate Inc. with over 8 years of experience in user-centered design. I specialize in creating intuitive and beautiful interfaces for complex web applications. My background in psychology informs my design process, allowing me to craft experiences that are not only aesthetically pleasing but also deeply resonant with user needs and behaviors. I am passionate about mentoring junior designers and fostering a collaborative and creative team environment.',
    aboutParagraph: '',
    shortBio: '',
    targetRoles: 'Product Designer, UX/UI Lead',
    strengths: 'User-centered design, Prototyping, Mentorship',
    industries: 'SaaS, Healthcare, E-commerce',
    achievements: 'Led redesign of a major e-commerce platform, resulting in a 20% increase in conversion rates.',
    tone: 'Professional',
  },
  experience: [],
  education: [],
  projects: [{
      id: 'resume-keeper-project',
      title: 'ResumeKeeper AI',
      description: 'An AI-powered resume builder that helps users create professional resumes with features like AI-generated content for about sections, job responsibilities, and project summaries.',
      role: 'Full Stack Developer',
      techStack: 'Next.js, React, TypeScript, TailwindCSS, Genkit, Firebase',
      bullets: [
        'Developed a full-stack application with a Next.js frontend and Genkit for AI features.',
        'Integrated Gemini APIs for content generation to assist users in crafting their resume.',
        'Designed and implemented a component-based UI using ShadCN and TailwindCSS.'
      ],
      evidence: [
        {
          type: 'url',
          value: 'https://9000-firebase-studio-1770862106164.cluster-rbhjeem4mfgjwrkwwvustjr6em.cloudworkstations.dev'
        }
      ],
      evidenceSummary: '',
    }],
};

type ResumeContextType = {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
