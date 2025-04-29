
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningHubTabs } from '@/components/peer-space/LearningHubTabs';
import LearningPathsSection, { LearningPath } from '@/components/peer-space/LearningPathsSection';
import { Content } from '@/components/peer-space/types';

const LearningHub: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [activeTab, setActiveTab] = useState('featured');
  
  // Mock data for learning paths with the complete LearningPath type
  const learningPaths: LearningPath[] = [
    {
      id: '1',
      title: '웹 개발 기초부터 마스터',
      description: 'HTML, CSS, JavaScript의 기초부터 React, Node.js까지 완벽하게 배워보세요.',
      progress: 25,
      steps: 12,
      completedSteps: 3,
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      totalCourses: 5,
      completedCourses: 1,
      difficulty: 'beginner',
      duration: '12주',
      enrolledUsers: 345,
      author: '김개발',
      tags: ['웹개발', 'JavaScript', 'React']
    },
    {
      id: '2',
      title: '데이터 분석 전문가 과정',
      description: 'Python, Pandas, NumPy를 활용한 데이터 분석 기술을 습득하세요.',
      progress: 60,
      steps: 8,
      completedSteps: 5,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      totalCourses: 4,
      completedCourses: 2,
      difficulty: 'intermediate',
      duration: '8주',
      enrolledUsers: 210,
      author: '이분석',
      tags: ['데이터분석', 'Python', 'Pandas']
    },
    {
      id: '3',
      title: '모바일 앱 개발 완성',
      description: 'Flutter를 사용하여 iOS와 Android 앱을 동시에 개발하는 방법을 배워보세요.',
      progress: 10,
      steps: 10,
      completedSteps: 1,
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
      totalCourses: 6,
      completedCourses: 0,
      difficulty: 'advanced',
      duration: '10주',
      enrolledUsers: 178,
      author: '박앱개발',
      tags: ['앱개발', 'Flutter', 'Dart']
    }
  ];
  
  // Mock featured content
  const featuredContent: Content[] = [
    {
      id: 'content-1',
      title: 'React 기초 강의',
      description: 'React의 기본 개념과 사용법을 배워봅시다.',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      type: 'course'
    },
    {
      id: 'content-2',
      title: '데이터 분석 특강',
      description: '실무에서 사용하는 데이터 분석 기법을 알아봅니다.',
      imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4',
      type: 'workshop'
    }
  ];
  
  const handlePathClick = (pathId: string) => {
    console.log('Clicked learning path:', pathId);
  };
  
  const handleContentClick = () => {
    console.log('Content clicked');
  };
  
  const handleAddContent = () => {
    console.log('Add content clicked');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">학습 허브</h1>
      
      <div className="mb-8">
        <LearningPathsSection 
          paths={learningPaths}
          onPathClick={handlePathClick}
        />
      </div>
      
      <div>
        <LearningHubTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddContent={handleAddContent}
          onContentClick={handleContentClick}
          isOwner={true}
        />
      </div>
    </div>
  );
};

export default LearningHub;
