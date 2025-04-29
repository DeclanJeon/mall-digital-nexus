import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  progress: number;
  steps: number;
  completedSteps: number;
  imageUrl: string;
}

interface LearningPathsSectionProps {
  paths: LearningPath[];
}

export const LearningPathsSection = ({ paths }: LearningPathsSectionProps) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center text-primary-300">
        <Compass className="mr-2 h-5 w-5" />
        학습 경로
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paths.map(path => (
          <Card key={path.id} className="overflow-hidden">
            <div className="h-32 overflow-hidden">
              <img 
                src={path.imageUrl} 
                alt={path.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-bold mb-2">{path.title}</h3>
              <Progress value={path.progress} className="h-1.5 mb-1" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-200">{path.completedSteps}/{path.steps} 단계</span>
                <span>{path.progress}%</span>
              </div>
              <Button className="w-full mt-4">계속하기</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningPathsSection;
