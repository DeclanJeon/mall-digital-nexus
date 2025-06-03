
import { useState, useCallback } from 'react';
import { Content } from '@/components/peer-space/types';

export const usePeerSpaceTabs = (initialTab: string = 'product') => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const filterContentByTab = useCallback((contents: Content[], tab: string) => {

    if (tab === 'product') {
      return contents;
    } else {
      return contents.filter(content => content.type === tab);
    }
  }, []);

  return {
    activeTab,
    handleTabChange,
    filterContentByTab
  };
};

export default usePeerSpaceTabs;
