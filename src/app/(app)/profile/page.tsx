"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import BasicsForm from "@/components/profile/BasicsForm";
import AboutForm from "@/components/profile/AboutForm";
import ExperienceForm from "@/components/profile/ExperienceForm";
import EducationForm from "@/components/profile/EducationForm";

export default function ProfilePage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your Profile</h1>
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="basics">
            <User className="w-4 h-4 mr-2" /> Basics
          </TabsTrigger>
          <TabsTrigger value="about">
            <Sparkles className="w-4 h-4 mr-2" /> About
          </TabsTrigger>
          <TabsTrigger value="experience">
            <Briefcase className="w-4 h-4 mr-2" /> Experience
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="w-4 h-4 mr-2" /> Education
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basics" className="mt-6">
          <BasicsForm />
        </TabsContent>
        <TabsContent value="about" className="mt-6">
          <AboutForm />
        </TabsContent>
        <TabsContent value="experience" className="mt-6">
          <ExperienceForm />
        </TabsContent>
        <TabsContent value="education" className="mt-6">
          <EducationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
