'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { ItemCard } from '@/components/ItemCard';
import { AddItemDialog } from '@/components/AddItemDialog';
import { ChatBox } from '@/components/ChatBox';
import { SummarizePanel } from '@/components/SummarizePanel';
import { ComparePanel } from '@/components/ComparePanel';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { getWorkspace, addItemToWorkspace, deleteItem, updateWorkspaceSummary } from '@/lib/store';
import { Workspace, Item } from '@/lib/types';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatBoxRef = React.useRef<any>(null);

  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    
    const ws = getWorkspace(id);
    if (!ws) {
      // Handle 404 - redirect to home
      router.push('/');
      return;
    }
    
    setWorkspace(ws);
    setIsLoading(false);
  }, [id, router]);

  const handleAddItem = (url: string, file?: File) => {
    if (!workspace) return;
    const newItem = addItemToWorkspace(workspace.id, url, file);
    setWorkspace(prev => prev ? ({
      ...prev,
      items: [newItem, ...prev.items]
    }) : null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!workspace) return;
    deleteItem(workspace.id, itemId);
    setWorkspace(prev => prev ? ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId)
    }) : null);
  };

  const handleUpdateSummary = (summary: string) => {
    if (!workspace) return;
    updateWorkspaceSummary(workspace.id, summary);
    setWorkspace(prev => prev ? ({
      ...prev,
      summary,
      lastSummaryAt: new Date().toISOString()
    }) : null);
  };

  if (isLoading || !workspace) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      
      {/* Header Section */}
      <div className="border-b bg-card px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate max-w-[200px] sm:max-w-none">{workspace.name}</h1>
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {workspace.items.length} items
                </span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Created {new Date(workspace.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-hidden min-h-0">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4">
          {/* Sources Section */}
          <div className="border rounded-lg bg-card">
            <div className="p-3 border-b">
              <h2 className="font-semibold text-foreground mb-3 text-sm">Sources</h2>
              <AddItemDialog onAdd={handleAddItem} />
            </div>
            <div className="p-3 max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {workspace.items.length > 0 ? (
                  workspace.items.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onDelete={handleDeleteItem} 
                    />
                  ))
                ) : (
                  <div className="h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-xs">No items yet.</p>
                    <p className="text-xs">Add links or PDFs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="border rounded-lg h-[60vh]">
            <ChatBox 
              items={workspace.items} 
              ref={chatBoxRef}
            />
          </div>

          {/* Summary & Compare Sections */}
          <div className="space-y-4">
            <div className="border rounded-lg max-h-60 overflow-hidden">
              <SummarizePanel 
                items={workspace.items} 
                summary={workspace.summary} 
                onUpdateSummary={handleUpdateSummary}
                chatBoxRef={chatBoxRef}
              />
            </div>
            
            <div className="border rounded-lg max-h-60 overflow-hidden">
              <ComparePanel items={workspace.items} chatBoxRef={chatBoxRef} />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6 h-full">
          {/* Left Panel: Sources */}
          <div className="w-[280px] border rounded-lg bg-card flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-foreground mb-3">Sources</h2>
              <AddItemDialog onAdd={handleAddItem} />
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {workspace.items.length > 0 ? (
                  workspace.items.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onDelete={handleDeleteItem} 
                    />
                  ))
                ) : (
                  <div className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-xs">No items yet.</p>
                    <p className="text-xs">Add links or PDFs</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Center Panel: Chat */}
          <div className="flex-1 border rounded-lg">
            <ChatBox 
              items={workspace.items} 
              ref={chatBoxRef}
            />
          </div>

          {/* Right Panel: Summarize & Compare */}
          <div className="w-[280px] flex flex-col gap-3">
            <div className="h-[40vh] border rounded-lg overflow-hidden">
              <SummarizePanel 
                items={workspace.items} 
                summary={workspace.summary} 
                onUpdateSummary={handleUpdateSummary}
                chatBoxRef={chatBoxRef}
              />
            </div>
            
            <div className="h-[40vh] border rounded-lg overflow-hidden">
              <ComparePanel items={workspace.items} chatBoxRef={chatBoxRef} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
