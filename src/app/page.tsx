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

  useEffect(() => {
    setWorkspaces(getWorkspaces());
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Your Research Workspaces</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage and synthesize your research collections.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" /> New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input 
                  placeholder="e.g. Thesis Literature Review" 
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button onClick={handleCreate} disabled={!newWorkspaceName.trim()} className="w-full sm:w-auto">Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {workspaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {workspaces.map(ws => (
              <WorkspaceCard key={ws.id} workspace={ws} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20 bg-card rounded-lg border border-dashed mx-2 sm:mx-0">
            <div className="text-muted-foreground mb-2 text-sm sm:text-base">No workspaces yet</div>
            <Button variant="link" onClick={() => setIsDialogOpen(true)}>Create your first one</Button>
          </div>
        )}
      </main>
    </div>
  );
}
