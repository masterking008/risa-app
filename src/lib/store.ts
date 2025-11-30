import { Workspace, Item } from './types';
import { seedWorkspaces } from './mockData';

const STORAGE_KEY = 'risa_workspaces_v1';

export function getWorkspaces(): Workspace[] {
  if (typeof window === 'undefined') return seedWorkspaces;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedWorkspaces));
    return seedWorkspaces;
  }
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse workspaces', e);
    return seedWorkspaces;
  }
}

export function saveWorkspaces(workspaces: Workspace[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
  }
}

export function getWorkspace(id: string): Workspace | undefined {
  const workspaces = getWorkspaces();
  return workspaces.find(w => w.id === id);
}

export function createWorkspace(name: string): Workspace {
  const workspaces = getWorkspaces();
  const newWorkspace: Workspace = {
    id: `ws-${Date.now()}`,
    name,
    items: [],
    createdAt: new Date().toISOString(),
  };
  
  saveWorkspaces([newWorkspace, ...workspaces]);
  return newWorkspace;
}

export async function addItemToWorkspace(workspaceId: string, url: string, file?: File): Promise<Item> {
  const workspaces = getWorkspaces();
  const workspaceIndex = workspaces.findIndex(w => w.id === workspaceId);
  
  if (workspaceIndex === -1) throw new Error('Workspace not found');
  
  let newItem: Item;
  
  if (file) {
    // Process PDF file using Gemini API
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    
    let content = 'PDF content extraction in progress...';
    let extractionStatus: 'pending' | 'extracting' | 'success' | 'failed' = 'extracting';
    let extractionError: string | undefined;
    
    try {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: base64.split(',')[1] // Remove data:application/pdf;base64, prefix
          }
        },
        'Extract and summarize the main content from this PDF document. Provide a comprehensive text extraction.'
      ]);
      
      content = result.response.text();
      extractionStatus = 'success';
      console.log('✅ PDF extraction successful:', { contentLength: content.length });
    } catch (error) {
      extractionStatus = 'failed';
      extractionError = error instanceof Error ? error.message : 'PDF extraction failed';
      console.error('❌ PDF extraction failed:', error);
      content = 'Failed to extract PDF content. Please try again.';
    }
    
    newItem = {
      id: `item-${Date.now()}`,
      type: 'pdf',
      title: file.name.replace('.pdf', ''),
      url: base64,
      domain: 'local-file',
      addedAt: new Date().toISOString(),
      content,
      extractionStatus,
      extractionError,
    };
  } else {
    const domain = new URL(url).hostname.replace('www.', '');
    let title = `New Item from ${domain}`;
    let content = '';
    let extractionStatus: 'pending' | 'extracting' | 'success' | 'failed' = 'extracting';
    let extractionError: string | undefined;
    
    try {
      console.log('🔄 Starting extraction for:', url);
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      if (response.ok) {
        const data = await response.json();
        title = data.title || title;
        content = data.content || '';
        extractionStatus = 'success';
        console.log('✅ Extraction successful:', { titleLength: title.length, contentLength: content.length });
      } else {
        const errorData = await response.json().catch(() => ({}));
        extractionStatus = 'failed';
        extractionError = errorData.error || `HTTP ${response.status}`;
        console.error('❌ Extraction failed:', response.status, errorData);
      }
    } catch (error) {
      extractionStatus = 'failed';
      extractionError = error instanceof Error ? error.message : 'Network error';
      console.error('❌ Network error during extraction:', error);
    }
    
    newItem = {
      id: `item-${Date.now()}`,
      type: url.endsWith('.pdf') ? 'pdf' : 'link',
      title,
      url,
      domain,
      addedAt: new Date().toISOString(),
      content,
      extractionStatus,
      extractionError,
    };
  }
  
  workspaces[workspaceIndex].items.unshift(newItem);
  saveWorkspaces(workspaces);
  
  return newItem;
}

export function updateWorkspaceSummary(workspaceId: string, summary: string) {
  const workspaces = getWorkspaces();
  const workspaceIndex = workspaces.findIndex(w => w.id === workspaceId);
  
  if (workspaceIndex === -1) return;
  
  workspaces[workspaceIndex].summary = summary;
  workspaces[workspaceIndex].lastSummaryAt = new Date().toISOString();
  
  saveWorkspaces(workspaces);
}

export function deleteItem(workspaceId: string, itemId: string) {
  const workspaces = getWorkspaces();
  const wIndex = workspaces.findIndex(w => w.id === workspaceId);
  
  if (wIndex === -1) return;
  
  workspaces[wIndex].items = workspaces[wIndex].items.filter(i => i.id !== itemId);
  saveWorkspaces(workspaces);
}

export function renameWorkspace(workspaceId: string, newName: string) {
  const workspaces = getWorkspaces();
  const wIndex = workspaces.findIndex(w => w.id === workspaceId);
  
  if (wIndex === -1) return;
  
  workspaces[wIndex].name = newName;
  saveWorkspaces(workspaces);
}

export function deleteWorkspace(workspaceId: string) {
  const workspaces = getWorkspaces();
  const filtered = workspaces.filter(w => w.id !== workspaceId);
  saveWorkspaces(filtered);
}
