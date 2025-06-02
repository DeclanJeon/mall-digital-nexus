
import React from 'react';
import { cn } from '@/lib/utils';

interface CustomCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({ 
  children, 
  className, 
  hover = true, 
  gradient = false 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 p-6",
        hover && "hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CustomCard;
