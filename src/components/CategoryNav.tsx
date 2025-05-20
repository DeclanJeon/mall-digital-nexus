
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CategoryNavProps {
  categories: {
    id: string;
    name: string;
    icon?: React.ReactNode;
    url: string;
  }[];
  activeId?: string;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, activeId }) => {
  return (
    <div className="flex overflow-x-auto py-2 gap-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeId === category.id ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap"
          asChild
        >
          <Link to={category.url}>
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.name}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default CategoryNav;
