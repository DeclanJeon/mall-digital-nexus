
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Clock, Users } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalCourses: number;
  completedCourses: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  participants: number;
  imageUrl: string;
  tags: string[];
}

interface LearningPathsSectionProps {
  paths: LearningPath[];
}

const LearningPathsSection: React.FC<LearningPathsSectionProps> = ({ paths }) => {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">초급</Badge>;
      case 'intermediate':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">중급</Badge>;
      case 'advanced':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">고급</Badge>;
      default:
        return null;
    }
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">학습 경로</h2>
        <Button variant="outline" className="flex items-center">
          모든 경로 보기 <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map(path => (
          <Card key={path.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 overflow-hidden">
              <img 
                src={path.imageUrl} 
                alt={path.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{path.title}</CardTitle>
                {getDifficultyBadge(path.difficulty)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">{path.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {path.duration}
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {path.participants}명
                </div>
                <div className="flex items-center text-gray-500">
                  <Award className="h-4 w-4 mr-1" />
                  {path.totalCourses}개 코스
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>진행률</span>
                  <span>{Math.round((path.completedCourses / path.totalCourses) * 100)}%</span>
                </div>
                <Progress value={(path.completedCourses / path.totalCourses) * 100} className="h-1.5" />
              </div>
              
              {path.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {path.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-2">계속하기</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningPathsSection;
