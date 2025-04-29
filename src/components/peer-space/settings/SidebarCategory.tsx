import React from 'react';

interface SidebarCategoryProps {
  title: string;
  children: React.ReactNode;
}

const SidebarCategory: React.FC<SidebarCategoryProps> = ({ 
  title, 
  children 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs uppercase text-text-200 font-semibold tracking-wider mb-2 px-3">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default SidebarCategory;
