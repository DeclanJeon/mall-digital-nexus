
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  steps: number;
  completedSteps: number;
  imageUrl: string;
  totalCourses: number;
  completedCourses: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  enrolledUsers: number;
  author: string;
  tags: string[];
}

interface LearningPathsSectionProps {
  paths: LearningPath[];
  onPathClick: (pathId: string) => void;
}

const LearningPathsSection: React.FC<LearningPathsSectionProps> = ({
  paths,
  onPathClick
}) => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">학습 경로</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          전체보기 <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map((path) => (
          <div
            key={path.id}
            className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
            onClick={() => onPathClick(path.id)}
          >
            <div className="aspect-video w-full rounded-md overflow-hidden mb-4">
              <img
                src={path.imageUrl}
                alt={path.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-medium mb-2">{path.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{path.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
              <span>진행률: {path.progress}%</span>
              <span>난이도: {path.difficulty === 'beginner' ? '초급' : path.difficulty === 'intermediate' ? '중급' : '고급'}</span>
            </div>
            <Progress value={path.progress} className="h-2 mb-4" />
            <div className="flex justify-between items-center text-sm">
              <span>{path.completedSteps}/{path.steps} 단계 완료</span>
              <span className="text-primary">{path.completedCourses}/{path.totalCourses} 코스 완료</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningPathsSection;
