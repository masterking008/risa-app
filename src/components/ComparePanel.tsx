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

III. Assessment of Strengths and Weaknesses (Structured Table)

IV. Synthesis and Scholarly Reconciliation/Judgment`;

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
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
          <GitCompare className="w-5 h-5 text-primary" />
          Compare
        </h3>
        <p className="text-sm text-muted-foreground mb-2">Select PDFs to compare:</p>
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
          onClick={handleCompare} 
          disabled={isLoading || selectedItems.length < 2}
          size="sm"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Comparing...
            </>
          ) : (
            `Compare ${selectedItems.length}`
          )}
        </Button>
      </div>
    </div>
  );
}