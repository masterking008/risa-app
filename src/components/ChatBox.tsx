'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Highlighter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatBoxProps {
  items: Item[];
  onAddMessage?: (message: Message) => void;
}

export const ChatBox = React.forwardRef<any, ChatBoxProps>(({ items, onAddMessage }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [highlights, setHighlights] = useState<{[messageId: string]: string[]}>({});
  const [currentSelection, setCurrentSelection] = useState<{text: string, messageId: string} | null>(null);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    onAddMessage?.(message);
  };

  const updateMessage = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content: newContent } : msg
    ));
  };

  React.useImperativeHandle(ref, () => ({
    addMessage,
    updateMessage
  }));

  const handleTextSelection = (messageId: string) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      setCurrentSelection(null);
      return;
    }
    
    const selectedText = selection.toString().trim();
    setCurrentSelection({ text: selectedText, messageId });
  };

  const highlightSelectedText = () => {
    if (!currentSelection) return;
    
    const messageHighlights = highlights[currentSelection.messageId] || [];
    const isAlreadyHighlighted = messageHighlights.includes(currentSelection.text);
    
    if (isAlreadyHighlighted) {
      // Remove highlight
      setHighlights(prev => ({
        ...prev,
        [currentSelection.messageId]: messageHighlights.filter(h => h !== currentSelection.text)
      }));
    } else {
      // Add highlight
      setHighlights(prev => ({
        ...prev,
        [currentSelection.messageId]: [...messageHighlights, currentSelection.text]
      }));
    }
    
    setCurrentSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  const highlightText = (text: string, messageId: string) => {
    const messageHighlights = highlights[messageId] || [];
    if (messageHighlights.length === 0) return text;
    
    let highlightedText = text;
    messageHighlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark style="background-color: #fef08a !important; color: #000 !important; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    });
    
    return highlightedText;
  };



  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setIsLoading(true);

    // Send to Gemini API
    setTimeout(async () => {
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `${input}\n\nCRITICAL INSTRUCTION: Never create tables, comparison tables, structured tables, or any tabular format. Do not use pipe symbols (|), dashes for table headers, or any table-like structure. For comparisons, assessments, or any structured content, use only:\n- Bullet points\n- Numbered lists\n- Paragraph format\n- Headings with text below\n\nAbsolutely no table formatting allowed.`;
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        const botMessage: Message = {
          id: `msg-${Date.now()}-bot`,
          type: 'bot',
          content: response,
          timestamp: new Date().toISOString(),
        };
        addMessage(botMessage);
      } catch (error) {
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          type: 'bot',
          content: 'Sorry, I encountered an error processing your request.',
          timestamp: new Date().toISOString(),
        };
        addMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    setInput('');
  };

  return (
    <Card className="h-full flex flex-col rounded-lg shadow-none border">
      <CardHeader className="pb-3 relative flex-shrink-0">
        <CardTitle className="text-lg">Chat with AI</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about your {items.length} sources
        </p>
        {currentSelection && (
          <Button
            onClick={highlightSelectedText}
            className="absolute top-3 right-3 w-10 h-10 rounded-full shadow-sm bg-slate-200 hover:bg-slate-300 text-slate-700"
            size="icon"
            title="Toggle highlight"
          >
            <Highlighter className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Start a conversation about your PDFs and links</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-[#002669] text-white'
                        : 'bg-slate-50'
                    }`}
                  >
                    <div 
                      className={`text-sm prose prose-sm max-w-none break-words select-text cursor-text ${
                        message.type === 'user' 
                          ? 'text-white [&_*]:text-white [&_strong]:!bg-white/20 [&_strong]:!text-white [&_strong]:px-1 [&_strong]:py-0.5 [&_strong]:rounded [&_strong]:font-semibold' 
                          : 'text-slate-900 [&_*]:text-slate-900 [&_p]:text-slate-900 [&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-900 [&_h4]:text-slate-900 [&_h5]:text-slate-900 [&_h6]:text-slate-900 [&_strong]:!bg-slate-200 [&_strong]:!text-slate-900 [&_strong]:px-1 [&_strong]:py-0.5 [&_strong]:rounded [&_strong]:font-semibold [&_em]:text-slate-900 [&_code]:bg-slate-200 [&_code]:text-slate-900 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-slate-200 [&_pre]:text-slate-900 [&_pre]:p-2 [&_pre]:rounded [&_li]:text-slate-900 [&_ul]:text-slate-900 [&_ol]:text-slate-900 [&_blockquote]:text-slate-700 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_a]:text-[#002669] [&_a]:underline [&_table]:!border-collapse [&_table]:!border [&_table]:!border-slate-300 [&_table]:!w-full [&_th]:!border [&_th]:!border-slate-300 [&_th]:!px-2 [&_th]:!py-1 [&_th]:!bg-slate-100 [&_th]:!text-slate-900 [&_th]:!font-bold [&_td]:!border [&_td]:!border-slate-300 [&_td]:!px-2 [&_td]:!py-1 [&_td]:!text-slate-900'
                      }`}
                      onMouseUp={() => handleTextSelection(message.id)}
                    >
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                      >
                        {(() => {
                          const messageHighlights = highlights[message.id] || [];
                          if (messageHighlights.length === 0) return message.content;
                          
                          let highlightedContent = message.content;
                          messageHighlights.forEach(highlight => {
                            const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                            highlightedContent = highlightedContent.replace(regex, '**$1**');
                          });
                          return highlightedContent;
                        })()}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="max-w-[80%] rounded-lg p-3 bg-slate-50">
                    <div className="flex items-center gap-1">
                      <span className="animate-pulse">•</span>
                      <span className="animate-pulse" style={{animationDelay: '0.2s'}}>•</span>
                      <span className="animate-pulse" style={{animationDelay: '0.4s'}}>•</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t p-4 bg-card flex-shrink-0 rounded-b-lg">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your sources..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="rounded-lg h-11"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="default" className="rounded-lg h-11 w-11 p-0 flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
});