'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '@/components/Header';
import { WorkspaceCard } from '@/components/WorkspaceCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getWorkspaces, createWorkspace } from '@/lib/store';
import { Workspace } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const loadWorkspaces = () => {
    setWorkspaces(getWorkspaces());
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleCreate = () => {
    if (!newWorkspaceName.trim()) return;
    
    const newWs = createWorkspace(newWorkspaceName);
    setWorkspaces(prev => [newWs, ...prev]);
    setNewWorkspaceName('');
    setIsDialogOpen(false);
    
    // Optional: Navigate directly to new workspace
    // router.push(`/workspace/${newWs.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Your Research Workspaces
              </h1>
              <p className="text-slate-600 text-sm">Organize and analyze your research materials</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#002669] hover:bg-[#001a4d] text-white gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-medium">
                  <Plus className="w-4 h-4" /> New Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 sm:mx-0 animate-scale-in">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Create New Workspace</DialogTitle>
                </DialogHeader>
                <div className="py-6">
                  <Input 
                    placeholder="e.g. Machine Learning Research, Climate Studies..." 
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    className="text-base py-3"
                  />
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={!newWorkspaceName.trim()} className="bg-[#002669] hover:bg-[#001a4d] text-white w-full sm:w-auto">
                    Create Workspace
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {workspaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {workspaces.map((ws, index) => (
                <div key={ws.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <WorkspaceCard workspace={ws} onUpdate={loadWorkspaces} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No workspaces yet</h3>
                <p className="text-slate-600 mb-6">Create your first workspace to start organizing your research</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  className="bg-[#002669] hover:bg-[#001a4d] text-white px-6 py-2.5 text-sm font-medium"
                >
                  Create Your First Workspace
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
