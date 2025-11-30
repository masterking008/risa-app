'use client';

import { useState } from 'react';
import { Plus, Link as LinkIcon, Upload, FileText } from 'lucide-react';
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

interface AddItemDialogProps {
  onAdd: (url: string, file?: File) => void;
}

export function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const [url, setUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'pdf'>('link');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAdd = () => {
    if (activeTab === 'link') {
      if (!url.trim()) return;
      onAdd(url);
    } else {
      if (!selectedFile) return;
      onAdd('', selectedFile);
    }
    setUrl('');
    setSelectedFile(null);
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" /> Add Link / PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item to Workspace</DialogTitle>
        </DialogHeader>
        
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'link'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('link')}
          >
            <LinkIcon className="w-4 h-4 inline mr-2" />
            Add Link
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pdf'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('pdf')}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Upload PDF
          </button>
        </div>

        <div className="py-4 space-y-4">
          {activeTab === 'link' ? (
            <>
              <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                <LinkIcon className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p>Paste any URL. We'll extract the content automatically.</p>
                  <p className="text-blue-600/80 text-xs">
                    Note: In the actual browser extension, you'd simply click "Save to Workspace" on any active tab.
                  </p>
                </div>
              </div>
              <Input 
                placeholder="https://arxiv.org/abs/..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                autoFocus
              />
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                <Upload className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p>Upload a PDF file to extract and analyze its content.</p>
                  <p className="text-green-600/80 text-xs">
                    Supported format: PDF files only
                  </p>
                </div>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-[#002669] rounded-md">
                  <FileText className="w-4 h-4 text-[#002669]" />
                  <span className="text-sm font-medium text-[#002669] flex-1 truncate">{selectedFile.name}</span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-[#002669] hover:text-[#001a4d] text-xs font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-6 text-center transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to select PDF file
                  </p>
                </label>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAdd} 
            disabled={activeTab === 'link' ? !url.trim() : !selectedFile}
          >
            Add {activeTab === 'link' ? 'Link' : 'PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
