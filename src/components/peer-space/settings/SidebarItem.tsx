import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}) => {
  return (
    <div 
      className={cn(
        'flex items-center py-2 px-3 rounded-lg cursor-pointer mb-1 transition-colors',
        active 
          ? 'bg-primary-300 text-white' 
          : 'hover:bg-primary-100/10 text-text-200 hover:text-primary-300'
      )}
      onClick={onClick}
    >
      <Icon className={cn('h-5 w-5 mr-3', active ? 'text-white' : 'text-primary-200')} />
      <span className={cn('text-sm font-medium', active ? 'text-white' : '')}>{label}</span>
    </div>
  );
};

export default SidebarItem;
