import React from 'react';

export interface CategoryNavProps {
  categories: {
    id: string;
    name: string;
    icon?: React.ReactNode;
    url: string;
  }[];
  activeId?: string;
}
