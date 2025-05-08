// src/components/community/hooks/usePlanetCreation.ts
import { useState, useCallback, RefObject } from 'react'; // RefObject 추가
import { useToast } from '@/hooks/use-toast';
import { Planet } from '@/components/community/types'; // PlanetType은 Planet에 포함되어 있음

export interface UsePlanetCreationParams {
  username: string;
  zoomLevel: number;
  universeMapRef: RefObject<HTMLDivElement>; // 부모로부터 ref를 받음
  onCreatePlanetCallback: (newPlanet: Planet) => void;
}

export const usePlanetCreation = ({
  username,
  zoomLevel,
  universeMapRef,
  onCreatePlanetCallback,
}: UsePlanetCreationParams) => {
  const { toast, dismiss } = useToast();

  const [isSelectingPlanetPosition, setIsSelectingPlanetPosition] =
    useState(false);
  const [newPlanetPositionForWizard, setNewPlanetPositionForWizard] = useState<
    [number, number, number] | null
  >(null);
  const [isPlanetWizardOpen, setIsPlanetWizardOpen] = useState(false);
  const [cursorPositionHint, setCursorPositionHint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMapClickForPosition = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isSelectingPlanetPosition || !universeMapRef.current) return;

      const rect = universeMapRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const mapPercentX = clickX / zoomLevel / (rect.width / zoomLevel);
      const mapPercentY = clickY / zoomLevel / (rect.height / zoomLevel);

      const posX = mapPercentX * 20 - 10;
      const posY = mapPercentY * 20 - 10;
      const posZ = Math.random() * 2 - 1;

      setNewPlanetPositionForWizard([posX, posY, posZ]);
      setIsSelectingPlanetPosition(false);
      setCursorPositionHint(null);
      setIsPlanetWizardOpen(true);
      if (dismiss) dismiss();
    },
    [isSelectingPlanetPosition, universeMapRef, zoomLevel, dismiss]
  );

  const handleMouseMoveOnMap = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isSelectingPlanetPosition || !universeMapRef.current) {
        setCursorPositionHint(null);
        return;
      }
      const rect = universeMapRef.current.getBoundingClientRect();
      setCursorPositionHint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [isSelectingPlanetPosition, universeMapRef]
  );

  const handleMouseLeaveMap = useCallback(() => {
    if (isSelectingPlanetPosition) {
      setCursorPositionHint(null);
    }
  }, [isSelectingPlanetPosition]);

  const startPlanetCreationProcess = useCallback(() => {
    setIsSelectingPlanetPosition(true);
    toast({
      title: '행성 위치 선택',
      description: '지도에서 새 행성의 위치를 클릭하세요.',
    });
  }, [toast]);

  const cancelPlanetCreationProcess = useCallback(() => {
    setIsSelectingPlanetPosition(false);
    setCursorPositionHint(null);
    if (dismiss) dismiss();
  }, [dismiss]);

  const handleWizardCreatePlanet = useCallback(
    (
      wizardData: Omit<
        Planet,
        | 'id'
        | 'position'
        | 'activeUsers'
        | 'recentPosts'
        | 'stage'
        | 'owner'
        | 'membersCount'
        | 'members'
        | 'activities'
        | 'health'
        | 'createdAt'
      > & { size: number }
    ) => {
      if (!newPlanetPositionForWizard) {
        toast({
          title: '오류',
          description: '행성 위치가 선택되지 않았습니다.',
          variant: 'destructive',
        });
        setIsPlanetWizardOpen(false);
        return;
      }
      const newPlanet: Planet = {
        id: `planet-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 7)}`,
        name: wizardData.name,
        description: wizardData.description,
        type: wizardData.type,
        topics: wizardData.topics,
        color: wizardData.color,
        isPrivate: wizardData.isPrivate,
        expiryDate: wizardData.expiryDate,
        lastActivity: new Date().toISOString(),
        size: wizardData.size,
        position: newPlanetPositionForWizard,
        activeUsers: 1,
        recentPosts: 0,
        stage: 'asteroid',
        owner: {
          name: username,
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
        },
        membersCount: 1,
        members: 1,
        activities: 0,
        health: 100,
        createdAt: new Date().toISOString(),
      };

      onCreatePlanetCallback(newPlanet);
      setNewPlanetPositionForWizard(null);
      setIsPlanetWizardOpen(false);
      toast({
        title: '행성 생성 완료!',
        description: `"${newPlanet.name}" 행성이 우주에 추가되었습니다.`,
      });
    },
    [newPlanetPositionForWizard, username, toast, onCreatePlanetCallback]
  );

  return {
    isSelectingPlanetPosition,
    isPlanetWizardOpen,
    setIsPlanetWizardOpen,
    cursorPositionHint,
    handleMapClickForPosition,
    handleMouseMoveOnMap,
    handleMouseLeaveMap,
    startPlanetCreationProcess,
    cancelPlanetCreationProcess,
    handleWizardCreatePlanet,
  };
};
