import { Workspace } from './types';

export const seedWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Test Workspace 1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    items: [
      {
        id: 'item-1',
        type: 'link',
        title: 'Immunotherapy in oncology',
        url: 'https://www.nature.com/articles/s41571-025-01105-y',
        domain: 'nature.com',
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        content: 'Research article on immunotherapy approaches in cancer treatment and oncology.',
      },
    ],
  },
  {
    id: 'ws-2',
    name: 'Test Workspace 2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    items: [
      {
        id: 'item-2',
        type: 'link',
        title: 'Cancer biomarkers and therapeutic targets',
        url: 'https://www.nature.com/articles/s41598-025-28685-0',
        domain: 'nature.com',
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        content: 'Scientific research on cancer biomarkers, therapeutic targets, and precision oncology approaches.',
      },
    ],
  },
];
