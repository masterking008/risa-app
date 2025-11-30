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

export function addItemToWorkspace(workspaceId: string, url: string, file?: File): Item {
  const workspaces = getWorkspaces();
  const workspaceIndex = workspaces.findIndex(w => w.id === workspaceId);
  
  if (workspaceIndex === -1) throw new Error('Workspace not found');
  
  let newItem: Item;
  
  if (file) {
    // Handle PDF file upload
    newItem = {
      id: `item-${Date.now()}`,
      type: 'pdf',
      title: file.name.replace('.pdf', ''),
      url: URL.createObjectURL(file), // Create blob URL for local file
      domain: 'local-file',
      addedAt: new Date().toISOString(),
      content: 'PDF content will be extracted here...', // Mock content
    };
  } else {
    // Handle URL
    const domain = new URL(url).hostname.replace('www.', '');
    newItem = {
      id: `item-${Date.now()}`,
      type: url.endsWith('.pdf') ? 'pdf' : 'link',
      title: `New Item from ${domain}`, // In a real app, we'd fetch title
      url,
      domain,
      addedAt: new Date().toISOString(),
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
