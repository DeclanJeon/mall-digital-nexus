import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { SectionType } from '../types';
import { getSectionDisplayName, saveSectionOrder } from '../utils/peerSpaceUtils';

interface PeerSpaceSettingsModalProps {
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  address: string;
  sections: SectionType[];
  setSections: React.Dispatch<React.SetStateAction<SectionType[]>>;
  hiddenSections: SectionType[];
  setHiddenSections: React.Dispatch<React.SetStateAction<SectionType[]>>;
}

const PeerSpaceSettingsModal: React.FC<PeerSpaceSettingsModalProps> = ({
  showSettingsModal,
  setShowSettingsModal,
  address,
  sections,
  setSections,
  hiddenSections,
  setHiddenSections,
}) => {
  const handleToggleSectionVisibility = (section: SectionType) => {
    if (hiddenSections.includes(section)) {
      setHiddenSections(hiddenSections.filter(s => s !== section));
      toast({ title: "섹션 표시", description: `${getSectionDisplayName(section)} 섹션이 표시됩니다.` });
    } else {
      setHiddenSections([...hiddenSections, section]);
      toast({ title: "섹션 숨김", description: `${getSectionDisplayName(section)} 섹션이 숨겨졌습니다.` });
    }
  };

  const handleMoveSectionUp = (index: number) => {
    if (index <= 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
    saveSectionOrder(address, newSections);
  };
  
  const handleMoveSectionDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    setSections(newSections);
    saveSectionOrder(address, newSections);
  };

  return (
    <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-xl font-bold">섹션 관리</DialogTitle></DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4">섹션의 순서를 변경하거나 표시 여부를 설정하세요.</p>
          <ul className="space-y-3">
            {sections.map((section, index) => (
              <li key={section} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{getSectionDisplayName(section)}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled={index === 0} onClick={() => handleMoveSectionUp(index)}>↑</Button>
                  <Button variant="outline" size="sm" disabled={index === sections.length - 1} onClick={() => handleMoveSectionDown(index)}>↓</Button>
                  <Button variant={hiddenSections.includes(section) ? "default" : "outline"} size="sm" onClick={() => handleToggleSectionVisibility(section)}>
                    {hiddenSections.includes(section) ? "표시" : "숨김"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PeerSpaceSettingsModal;