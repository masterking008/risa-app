'use client';

import Link from 'next/link';
import { Clock, FileText, ArrowRight, Sparkles, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Workspace } from '@/lib/types';
import { renameWorkspace, deleteWorkspace } from '@/lib/store';
import { useState } from 'react';

interface WorkspaceCardProps {
  workspace: Workspace;
  onUpdate?: () => void;
}

export function WorkspaceCard({ workspace, onUpdate }: WorkspaceCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(workspace.name);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      renameWorkspace(workspace.id, newName.trim());
      setIsRenaming(false);
      onUpdate?.();
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete "${workspace.name}"?`)) {
      deleteWorkspace(workspace.id);
      onUpdate?.();
    }
  };

  return (
    <div className="h-full bg-white border border-slate-200 rounded-xl p-6 group relative">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          {isRenaming ? (
            <form onSubmit={handleRename} className="flex-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                autoFocus
                className="w-full text-lg font-semibold text-slate-900 border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#002669]"
              />
            </form>
          ) : (
            <Link href={`/workspace/${workspace.id}`} className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-[#002669] transition-colors">
                {workspace.name}
              </h3>
            </Link>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                  <button
                    onClick={() => {
                      setIsRenaming(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <Link href={`/workspace/${workspace.id}`}>
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
        </Link>
      </div>
    </div>
  );
}
