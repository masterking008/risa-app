'use client';

import { useState } from 'react';
import { GitCompare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Item } from '@/lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ComparePanelProps {
  items: Item[];
  chatBoxRef?: any;
}

export function ComparePanel({ items, chatBoxRef }: ComparePanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const comparePrompt = `Act as a Comparative Scholar specializing in the documents' respective subject matter. Your task is to conduct a structured, dialectical comparison of the attached documents/links. The goal is to highlight not just differences, but the analytical relationship between the texts.

Key Directives:

Identify Core Points of Convergence (Similarities): Detail the common ground, shared assumptions, overlapping findings, or agreed-upon theoretical frameworks.

Identify Core Points of Divergence (Differences/Contradictions): Detail the significant differences in thesis, methodology, data interpretation, or conclusion. Clearly explain the nature of the conflict or disparity.

Analyze Underlying Theoretical Frameworks: For each document, briefly identify and contrast the major theoretical lens or perspective being used (e.g., post-structuralism vs. empiricism, classical economics vs. behavioral economics).

Evaluate Relative Strengths and Weaknesses: For each file, provide a brief academic assessment of its most compelling strength (e.g., robust empirical data, novel theoretical contribution) and its most significant weakness (e.g., small sample size, lack of external validity).

Synthesis and Concluding Judgment: Provide a final, high-level summary paragraph synthesizing the comparison and offering a nuanced academic judgment on which perspective offers the more compelling or well-supported argument, or how they might be reconciled.

Desired Output Structure (Use a Table for Clarity):

I. Introduction: Framing the Comparison

II. Comparative Analysis (Thesis, Findings, Methodology)

III. Assessment of Strengths and Weaknesses (Do not use table, give bulleted points)

IV. Synthesis and Scholarly Reconciliation/Judgment


Do not use tables anywhere. Ensure clarity, academic rigor, and depth of analysis throughout your response.`;

  const handleCompare = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    const messageId = `msg-${Date.now()}`;
    
    // Add "Comparing..." message to chat
    if (chatBoxRef?.current?.addMessage) {
      chatBoxRef.current.addMessage({
        id: messageId,
        type: 'bot',
        content: 'Comparing selected documents...',
        timestamp: new Date().toISOString(),
      });
    }
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
      const itemTitles = selectedItemsData.map(item => item.title).join(', ');
      const fullPrompt = `${comparePrompt}\n\nCompare these documents: ${itemTitles}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = result.response.text();
      
      // Update the existing message with result
      if (chatBoxRef?.current?.updateMessage) {
        chatBoxRef.current.updateMessage(messageId, response);
      }
    } catch (error) {
      // Update the existing message with error
      if (chatBoxRef?.current?.updateMessage) {
        chatBoxRef.current.updateMessage(messageId, 'Error generating comparison. Please try again.');
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
    <div className="h-full flex flex-col bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#002669] flex items-center justify-center">
            <GitCompare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AI Compare</h3>
            <p className="text-xs text-slate-500">Compare multiple documents</p>
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
          onClick={handleCompare} 
          disabled={isLoading || selectedItems.length < 2}
          className="w-full bg-[#002669] hover:bg-[#001a4d] text-white py-3 text-sm font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Comparing Documents...
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4 mr-2" />
              Compare {selectedItems.length} Document{selectedItems.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}