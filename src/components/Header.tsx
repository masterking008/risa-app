import Link from 'next/link';
import { Microscope, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 hover:text-[#002669] transition-colors">
          <div className="bg-[#002669] p-1.5 rounded-md">
            <Microscope className="w-4 h-4 text-white" />
          </div>
          <span>RISA LABS</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-100">
            <Bell className="w-4 h-4 text-slate-600" />
          </Button>
          
          <div className="relative group">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-medium text-xs cursor-pointer hover:bg-slate-300 transition-colors">
              BT
            </div>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-3">
              <div className="text-sm font-medium text-slate-900">Bhavesh Tanan</div>
              <div className="text-xs text-slate-600">bhaveshtanan@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
