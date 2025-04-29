
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

const ExternalIndicator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Badge 
      variant="outline" 
      className={`bg-black/60 text-white border-0 text-xs px-2 py-0.5 flex items-center ${className || ''}`}
    >
      <ExternalLink className="h-2.5 w-2.5 mr-1" /> 외부
    </Badge>
  );
};

export default ExternalIndicator;
