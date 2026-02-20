
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ResumeData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const profilePicPlaceholder = PlaceHolderImages.find(img => img.id === 'profile-picture');

const initialResumeData: ResumeData = {
  basics: {
    name: 'Grant Cronce',
    email: 'gcronce2010@gmail.com',
    phone: '+1 810 941 7360',
    location: 'Lexington, MI',
    website: '',
    currentRole: 'Assistant Store Manager',
    company: 'Rent a Center',
    profilePicture: profilePicPlaceholder?.imageUrl || ''
  },
  about: {
    summary: 'Experienced manager with a demonstrated history of success in the retail industry. Skilled in sales, team leadership, and customer relationship management. Currently pursuing a degree in Information Technology and Networking, with certifications in Cloud Computing and Cyber Security, to transition into a technology-focused role. Proven ability to drive growth and exceed financial goals.',
    aboutParagraph: 'Experienced manager with a demonstrated history of success in the retail industry. Skilled in sales, team leadership, and customer relationship management. Currently pursuing a degree in Information Technology and Networking, with certifications in Cloud Computing and Cyber Security, to transition into a technology-focused role. Proven ability to drive growth and exceed financial goals.',
    shortBio: 'Experienced retail manager transitioning to a technology-focused role with skills in sales, leadership, and IT.',
    targetRoles: 'Information Technology, Cloud Computing, Cyber Security',
    strengths: 'Team Leadership, Sales Management, Customer Relationship Management, IT Networking',
    industries: 'Retail, Technology',
    achievements: "Grew customer base from 390 to 600 in 8 months. Achieved 'Store of the Month' 3 times in 8 months.",
    tone: 'Professional',
  },
  experience: [
    {
      id: 'exp1',
      role: 'Assistant Store Manager',
      company: 'Rent a Center',
      startDate: 'March 2024',
      endDate: 'Present',
      responsibilities: ['Managed all store sales activities and revenue generation.', 'Led and managed store staff, including scheduling, training, and performance.', 'Handled all daily operational paperwork, including opening and closing procedures.'],
    },
    {
      id: 'exp2',
      role: 'Sales Floor Lead',
      company: 'Jars Cannabis',
      startDate: 'February 2023',
      endDate: 'September 2023',
      responsibilities: ['Directed all sales aspects on the floor and guided the sales team to meet targets.', 'Oversaw inventory control, product stocking, and new customer onboarding processes.', 'Ensured sales goals were consistently met and exceeded while delivering 100% customer satisfaction.'],
    },
    {
      id: 'exp3',
      role: 'Store Manager',
      company: 'Continental Home Centers',
      startDate: 'January 2022',
      endDate: 'January 2023',
      responsibilities: ["Managed all facets of store operations, including hiring and training a team of 10 employees.", "Successfully met and surpassed monthly financial goals and budgets.", "Expanded the customer base from 390 to 600 within an 8-month period."],
    }
  ],
  education: [
    {
      id: 'edu7',
      institution: 'Shields Up: Cybersecurity Job Simulation',
      degree: 'Certificate of Completion',
      startDate: 'Feb 2024',
      endDate: 'Feb 2024',
    },
    {
      id: 'edu6',
      institution: 'GenAI Job Simulation',
      degree: 'Certificate of Completion',
      startDate: 'Feb 2024',
      endDate: 'Feb 2024',
    },
    {
      id: 'edu1',
      institution: 'Devry University',
      degree: 'Information Technology and Networking',
      startDate: '2024',
      endDate: 'Present',
    },
    {
      id: 'edu2',
      institution: 'Springpod',
      degree: 'Cloud Computing Certificate',
      startDate: '2024',
      endDate: '2024',
    },
    {
      id: 'edu3',
      institution: 'Springpod',
      degree: 'Digital Skills & Cyber Security Certificate',
      startDate: '2024',
      endDate: '2024',
    },
    {
      id: 'edu4',
      institution: 'Devry University',
      degree: 'Robotics and Controls Certificate',
      startDate: '2023',
      endDate: '2024',
    },
    {
      id: 'edu5',
      institution: 'Algonac High School',
      degree: 'High School Diploma',
      startDate: '2000',
      endDate: '2003',
    }
  ],
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
