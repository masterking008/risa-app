'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { generateSummary } from '@/lib/mockAI';
import { Item } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

interface SummarizePanelProps {
  items: Item[];
  summary?: string;
  onUpdateSummary: (summary: string) => void;
  chatBoxRef?: any;
}

export function SummarizePanel({ items, summary, onUpdateSummary, chatBoxRef }: SummarizePanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSummarize = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    const messageId = `msg-${Date.now()}`;
    
    // Add "Summarizing..." message to chat
    if (chatBoxRef?.current?.addMessage) {
      chatBoxRef.current.addMessage({
        id: messageId,
        type: 'bot',
        content: 'Summarizing selected documents...',
        timestamp: new Date().toISOString(),
      });
    }
    
    try {
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
      const summaryResult = await generateSummary(selectedItemsData);
      
      // Update the existing message with result
      if (chatBoxRef?.current?.updateMessage) {
        chatBoxRef.current.updateMessage(messageId, summaryResult);
      }
      
      onUpdateSummary(summaryResult);
    } catch (error) {
      // Update the existing message with error
      if (chatBoxRef?.current?.updateMessage) {
        chatBoxRef.current.updateMessage(messageId, 'Error generating summary. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          Summarize
        </h3>
        <p className="text-sm text-muted-foreground mb-2">Select PDFs to summarize:</p>
        <div className="space-y-1 mb-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-colors ${
                selectedItems.includes(item.id)
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted'
              }`}
              onClick={() => handleItemToggle(item.id)}
            >
              <div className={`w-2 h-2 rounded-full ${
                selectedItems.includes(item.id) ? 'bg-primary' : 'bg-muted-foreground'
              }`} />
              <span className="text-xs flex-1 break-words">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t p-4">
        <Button 
          onClick={handleSummarize} 
          disabled={isLoading || selectedItems.length === 0}
          size="sm"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Summarizing...
            </>
          ) : (
            `Summarize ${selectedItems.length}`
          )}
        </Button>
      </div>
    </div>
  );
}