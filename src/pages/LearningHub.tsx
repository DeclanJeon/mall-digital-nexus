import React, { useState, useEffect } from 'react';
import { Content, Quest } from '@/components/peer-space/types';
import LearningHubTopBar from '@/components/peer-space/LearningHubTopBar';
import LearningHubTabs from '@/components/peer-space/LearningHubTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { 
  Trophy, Award, Compass, Users 
} from 'lucide-react';
import { LearningHubQuestDetailsModal } from '@/components/peer-space/modals/LearningHubQuestDetailsModal';
import { UserLevelDisplay } from '@/components/peer-space/UserLevelDisplay';
import { ActiveQuestsSection } from '@/components/peer-space/ActiveQuestsSection';
import { LearningPathsSection } from '@/components/peer-space/LearningPathsSection';
import { AchievementsSection } from '@/components/peer-space/AchievementsSection';
import { CommunityActivitySection } from '@/components/peer-space/CommunityActivitySection';

import { 
  learningHubData,
  featuredContent,
  activeQuests,
  achievements,
  learningPaths,
  communityActivities
} from '@/components/peer-space/mockData';

const LearningHub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showQuestDetailsModal, setShowQuestDetailsModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(activeQuests[0]);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    setIsOwner(userLoggedIn);
    
    if (!userLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [navigate, location]);

  if (!isLoggedIn) {
    return null;
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? '팔로우 취소' : '팔로우 완료',
      description: isFollowing ? 
        '더 이상 이 피어를 팔로우하지 않습니다.' : 
        '이제 이 피어의 새로운 소식을 받아보실 수 있습니다.',
    });
  };

  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
    setShowQuestDetailsModal(true);
  };

  const toggleNotification = () => {
    setIsNotificationOn(!isNotificationOn);
  };

  const handleJoinChallenge = () => {
    toast({
      title: '챌린지 참여 완료',
      description: '새로운 학습 챌린지에 참여하셨습니다! 진행 상황은 대시보드에서 확인하세요.',
    });
  };

  return (
    <div className="min-h-screen bg-bg-100">
      <LearningHubTopBar
        peerSpaceData={learningHubData}
        isOwner={isOwner}
        isFollowing={isFollowing}
        toggleNotification={toggleNotification}
        isNotificationOn={isNotificationOn}
        onFollow={handleFollow}
        onMessage={() => {}}
        onQRGenerate={() => {}}
        onSettings={() => navigate('/learning-hub/settings')}
      />
      
      <UserLevelDisplay peerSpaceData={learningHubData} />
      
      <main className="container mx-auto px-4 py-8">
        <ActiveQuestsSection 
          quests={activeQuests}
          onQuestClick={handleQuestClick}
        />
        
        <LearningHubTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          featuredContent={featuredContent}
          isOwner={isOwner}
          onAddContent={() => {}}
          onContentClick={() => {}}
        />
        
        <LearningPathsSection paths={learningPaths} />
        <AchievementsSection achievements={achievements} />
        <CommunityActivitySection activities={communityActivities} />
        
        <section className="mb-10">
          <Card className="bg-primary-300 text-white">
            <CardContent className="p-6">
              <div className="md:flex justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">새로운 학습 챌린지에 도전하세요!</h2>
                  <p className="text-primary-100">21일 동안의 학습 습관 형성 프로그램에 참여하고 특별한 보상을 받으세요.</p>
                </div>
                <Button variant="secondary" size="lg" onClick={handleJoinChallenge}>
                  지금 참여하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <LearningHubQuestDetailsModal 
        quest={selectedQuest}
        isOpen={showQuestDetailsModal}
        onOpenChange={setShowQuestDetailsModal}
      />
    </div>
  );
};

export default LearningHub;
