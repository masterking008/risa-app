export interface Item {
  id: string;
  type: 'link' | 'pdf';
  title: string;
  url: string;
  domain: string;
  addedAt: string;
  content?: string;
  extractionStatus?: 'pending' | 'extracting' | 'success' | 'failed';
  extractionError?: string;
}

export interface Workspace {
  id: string;
  name: string;
  items: Item[];
  createdAt: string;
  summary?: string;
  lastSummaryAt?: string;
}
