import { Workspace } from './types';

export const seedWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Federated Learning Frameworks',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    items: [],
  },
  {
    id: 'ws-2',
    name: 'Q4 Competitor Analysis',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    items: [
      {
        id: 'item-4',
        type: 'link',
        title: 'Notion AI Features Release Notes',
        url: 'https://www.notion.so/releases',
        domain: 'notion.so',
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      },
      {
        id: 'item-5',
        type: 'link',
        title: 'Arc Browser Max: The Future of Browsing',
        url: 'https://arc.net/max',
        domain: 'arc.net',
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      },
    ],
  },
];
