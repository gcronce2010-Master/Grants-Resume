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
  },
  experience: [],
  education: [],
  projects: [],
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
