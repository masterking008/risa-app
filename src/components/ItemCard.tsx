import { Trash2, ExternalLink, FileText, Link as LinkIcon, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Item } from '@/lib/types';

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
}

export function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <Card className="p-2 group hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center flex-shrink-0 text-muted-foreground">
          {item.type === 'pdf' ? <FileText className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
        </div>
        
        <div className="min-w-0 flex-1 overflow-hidden">
          <h3 className="font-medium text-foreground text-xs leading-tight mb-1 break-words line-clamp-2">{item.title}</h3>
          <div className="text-xs text-muted-foreground">
            <div className="truncate text-xs">{item.domain}</div>
            {item.extractionStatus && (
              <div className="flex items-center gap-1 mt-1">
                {item.extractionStatus === 'extracting' && (
                  <><Loader2 className="w-3 h-3 animate-spin text-blue-500" /><span className="text-blue-500">Extracting...</span></>
                )}
                {item.extractionStatus === 'success' && (
                  <><CheckCircle2 className="w-3 h-3 text-green-500" /><span className="text-green-600">Extracted</span></>
                )}
                {item.extractionStatus === 'failed' && (
                  <><XCircle className="w-3 h-3 text-red-500" /><span className="text-red-600" title={item.extractionError}>Failed: {item.extractionError}</span></>
                )}
                {item.extractionStatus === 'pending' && (
                  <><AlertCircle className="w-3 h-3 text-yellow-500" /><span className="text-yellow-600">Pending</span></>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" asChild className="h-5 w-5 text-muted-foreground hover:text-primary">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-2.5 h-2.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
