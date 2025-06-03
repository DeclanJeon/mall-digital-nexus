import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center text-primary-300">
        <Award className="mr-2 h-5 w-5" />
        획득한 업적
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map(achievement => (
          <Card 
            key={achievement.id}
            className={`text-center ${!achievement.unlocked && 'opacity-60 grayscale'}`}
          >
            <CardContent className="pt-6 pb-4">
              <div className="text-3xl mb-3">{achievement.icon}</div>
              <h3 className="font-bold mb-1">{achievement.name}</h3>
              <p className="text-xs text-text-200">{achievement.description}</p>
              
              <div className="mt-2">
                {achievement.unlocked ? (
                  <Badge className="bg-green-500">획득함</Badge>
                ) : (
                  <Badge variant="outline">잠김</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AchievementsSection;
