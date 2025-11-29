import Link from 'next/link';
import { Microscope } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-foreground hover:opacity-80 transition-opacity">
          <div className="bg-primary p-1 sm:p-1.5 rounded-md">
            <Microscope className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          Risa <span className="hidden sm:inline text-muted-foreground font-normal text-sm ml-1">Research Workspace</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block text-sm text-muted-foreground">v1.0.0 (Demo)</div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary border flex items-center justify-center text-secondary-foreground font-medium text-xs">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
