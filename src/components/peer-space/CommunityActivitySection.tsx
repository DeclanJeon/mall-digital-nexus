import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  userImage: string;
  action: string;
  target: string;
  time: string;
  icon: string;
}

interface CommunityActivitySectionProps {
  activities: Activity[];
}

export const CommunityActivitySection = ({ activities }: CommunityActivitySectionProps) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center text-primary-300">
        <Users className="mr-2 h-5 w-5" />
        커뮤니티 활동
      </h2>
      
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {activities.map(activity => (
              <li key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={activity.userImage} />
                    <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold">{activity.user}</span>
                      <span className="text-text-200 text-sm ml-2">{activity.action}</span>
                    </div>
                    <p className="text-sm mt-1">{activity.target}</p>
                    <div className="text-xs text-text-200 mt-1">{activity.time}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="border-t p-3">
          <Button variant="ghost" className="w-full text-sm">
            모든 활동 보기
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default CommunityActivitySection;
