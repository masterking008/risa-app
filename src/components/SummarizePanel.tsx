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
    <div className="h-full flex flex-col bg-white rounded-lg border shadow-elegant overflow-hidden">
      <div className="p-5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#002669] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AI Summarize</h3>
            <p className="text-xs text-slate-500">Generate insights from your documents</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-700">Select documents:</p>
            <span className="text-xs text-slate-500">{selectedItems.length} of {items.length}</span>
          </div>
          
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedItems.includes(item.id)
                    ? 'bg-slate-100 border border-slate-300 shadow-sm'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
                onClick={() => handleItemToggle(item.id)}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedItems.includes(item.id) 
                    ? 'bg-[#002669] border-[#002669]' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}>
                  {selectedItems.includes(item.id) && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm flex-1 break-words text-slate-700 font-medium">{item.title}</span>
              </div>
            ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <div className="border-t bg-white p-4 rounded-b-lg flex-shrink-0">
        <Button 
          onClick={handleSummarize} 
          disabled={isLoading || selectedItems.length === 0}
          className="w-full bg-[#002669] hover:bg-[#001a4d] text-white py-3 text-sm font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Summary...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Summarize {selectedItems.length} Document{selectedItems.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}