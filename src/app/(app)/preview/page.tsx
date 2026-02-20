"use client";

import { useResume } from "@/context/ResumeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Globe, MapPin, ExternalLink, FileText, Briefcase, Cpu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function PreviewPage() {
  const { resumeData } = useResume();
  const { basics, about, experience, education, projects } = resumeData;
  const [url, setUrl] = useState("");
  const [fgColor, setFgColor] = useState('hsl(224 71% 4%)');
  const [bgColor, setBgColor] = useState('hsl(0 0% 100%)');

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
      const styles = getComputedStyle(document.documentElement);
      const fg = styles.getPropertyValue('--foreground').trim();
      const bg = styles.getPropertyValue('--card').trim();
      setFgColor(`hsl(${fg})`);
      setBgColor(`hsl(${bg})`);
    }
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="bg-card p-8 md:p-12 rounded-xl shadow-lg max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="flex flex-col md:flex-row gap-8 items-start flex-grow">
            <Avatar className="w-32 h-32 text-4xl">
              <AvatarImage src={basics.profilePicture} alt={basics.name} data-ai-hint="profile portrait" />
              <AvatarFallback>{getInitials(basics.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <h1 className="text-5xl font-bold text-primary">{basics.name}</h1>
              <h2 className="text-2xl font-medium text-foreground/80 mt-1">{basics.currentRole} at {basics.company}</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                {about.shortBio || "A dedicated professional with a passion for excellence."}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mt-6">
                  {basics.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4"/>{basics.email}</div>}
                  {basics.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4"/>{basics.phone}</div>}
                  {basics.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/>{basics.location}</div>}
                  {basics.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4"/><Link href={basics.website} className="text-primary hover:underline">{basics.website}</Link></div>}
              </div>
            </div>
        </div>
        {url && (
            <div className="text-center p-3 border rounded-lg hidden md:block">
                <QRCode value={url} size={100} bgColor={bgColor} fgColor={fgColor} />
                <p className="text-xs text-muted-foreground mt-2">Scan to view</p>
            </div>
        )}
      </header>

      <Separator className="my-10" />

      <main className="space-y-12">
        <section>
          <h3 className="text-2xl font-semibold border-l-4 border-primary pl-4 mb-6">About Me</h3>
          <p className="text-foreground/80 leading-relaxed">
            {about.aboutParagraph || about.summary || "No about information provided."}
          </p>
        </section>

        {experience.length > 0 && <section>
          <h3 className="text-2xl font-semibold border-l-4 border-primary pl-4 mb-6">Work Experience</h3>
          <div className="space-y-8">
            {experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-lg font-bold">{job.role}</h4>
                  <div className="text-sm text-muted-foreground">{job.startDate} - {job.endDate || 'Present'}</div>
                </div>
                <h5 className="text-md font-medium text-primary">{job.company}</h5>
                <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
                  {job.responsibilities.map((resp, i) => resp && <li key={i}>{resp}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>}

        {education.length > 0 && <section>
          <h3 className="text-2xl font-semibold border-l-4 border-primary pl-4 mb-6">Education</h3>
          <div className="space-y-6">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-lg font-bold">{edu.institution}</h4>
                  <div className="text-sm text-muted-foreground">{edu.startDate} - {edu.endDate}</div>
                </div>
                <h5 className="text-md font-medium text-foreground/80">{edu.degree}</h5>
              </div>
            ))}
          </div>
        </section>}

        {projects.length > 0 && <section>
          <h3 className="text-2xl font-semibold border-l-4 border-primary pl-4 mb-6">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                   {project.role && <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1"><Briefcase className="w-4 h-4"/><span>{project.role}</span></div>}
                   {project.techStack && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Cpu className="w-4 h-4"/><span>{project.techStack}</span></div>}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                   {project.bullets && project.bullets.length > 0 && (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-foreground/80 text-sm">
                      {project.bullets.map((bullet, i) => bullet && <li key={i}>{bullet}</li>)}
                    </ul>
                  )}
                   <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Evidence</h4>
                    {project.evidence.map((e) => (
                      <Button asChild key={e.id} variant="outline" size="sm" className="w-full justify-start">
                         <Link href={e.type === 'url' ? e.value : '#'} target="_blank" rel="noopener noreferrer">
                            {e.type === 'url' ? <ExternalLink className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                            <span className="truncate">{e.value}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>}
      </main>
    </div>
  );
}
