import Link from 'next/link';
import { Clock, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Workspace } from '@/lib/types';

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Link href={`/workspace/${workspace.id}`} className="block group">
      <div className="h-full bg-white border border-slate-200 rounded-xl p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-[#002669] transition-colors">
              {workspace.name}
            </h3>
            <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>{workspace.items.length} items</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{new Date(workspace.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          
          {workspace.lastSummaryAt && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
              <Sparkles className="w-3 h-3" />
              <span className="font-medium">AI Summary</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
