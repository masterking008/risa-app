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
        
        const result = await model.generateContent(input);
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
    <Card className="h-full flex flex-col rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Chat with AI</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about your {items.length} sources
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-300px)]">
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
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div 
                      className={`text-sm prose prose-sm max-w-none break-words select-text cursor-text ${
                        message.type === 'user' 
                          ? 'text-white [&_*]:text-white' 
                          : 'text-white [&_*]:text-white [&_p]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h6]:text-white [&_strong]:text-white [&_em]:text-white [&_code]:text-white [&_pre]:text-white [&_li]:text-white [&_ul]:text-white [&_ol]:text-white [&_blockquote]:text-white [&_a]:text-white'
                      }`}
                      onMouseUp={() => handleTextSelection(message.id)}
                    >
                      {highlights[message.id] && highlights[message.id].length > 0 ? (
                        <div 
                          className="prose prose-sm max-w-none [&_mark]:bg-yellow-300 [&_mark]:!text-black [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded [&_mark]:font-medium [&_mark]:shadow-sm"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightText(message.content, message.id) 
                          }} 
                        />
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[rehypeKatex]}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
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
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
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
        
        <div className="border-t p-2 sm:p-4 bg-card flex-shrink-0 rounded-b-lg">
          <div className="flex gap-1 sm:gap-2">
            <Input
              placeholder="Ask about your sources..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="rounded-lg text-sm sm:text-base"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="rounded-lg px-2 sm:px-4">
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
        
        {/* Floating Action Button */}
        <Button
          onClick={highlightSelectedText}
          disabled={!currentSelection}
          className={`fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg z-50 ${
            currentSelection ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
          size="icon"
          title={currentSelection ? 'Toggle highlight' : 'Select text first'}
        >
          <Highlighter className="w-5 h-5" />
        </Button>
        
        {currentSelection && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-40">
            Text selected - click highlight button
          </div>
        )}
      </CardContent>
    </Card>
  );
});