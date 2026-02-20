"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NotebookText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/profile', label: 'Profile' },
  { href: '/projects', label: 'Projects' },
  { href: '/preview', label: 'Preview' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/profile" className="flex items-center gap-2">
          <NotebookText className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">ResumeKeeper</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                'text-muted-foreground transition-colors hover:text-primary',
                pathname === item.href && 'text-primary'
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="md:hidden">
            {/* Mobile menu could be implemented here */}
        </div>
      </div>
    </header>
  );
}
