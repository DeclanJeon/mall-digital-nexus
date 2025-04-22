import { Quest } from './types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

interface ActiveQuestsSectionProps {
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
}

export const ActiveQuestsSection = ({ quests, onQuestClick }: ActiveQuestsSectionProps) => {
  // ... 기존 코드 유지
};

export default ActiveQuestsSection;
