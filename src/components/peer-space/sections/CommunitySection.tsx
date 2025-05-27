import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Content } from '@/types/space';
import { FileText, Heart, MessageSquare, User } from 'lucide-react';

interface CommunitySectionProps {
  isOwner: boolean;
  posts: Content[];
  owner: string;
  onNavigateToSection?: (section: string) => void;
  showAll?: boolean;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({
  isOwner,
  posts,
  owner,
  onNavigateToSection,
  showAll = false
}) => {
  const displayedPosts = showAll ? posts : posts.slice(0, 3);

  return (
    <section className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">커뮤니티</h2>
        {!showAll && posts.length > 3 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onNavigateToSection?.('community')}
          >
            더 보기
          </Button>
        )}
      </div>
      
      <div className="p-6">
        {displayedPosts.length > 0 ? (
          <div className="space-y-4">
            {displayedPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex md:items-center p-4 flex-col md:flex-row gap-4">
                  <div className="md:w-1/3 w-full h-48 md:h-32 rounded-md overflow-hidden bg-gray-100">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-2/3 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      {post.tags?.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-100">{tag}</Badge>
                      ))}
                      <span className="text-xs text-gray-500">{post.category}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes || 0}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments || 0}
                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {owner}
                        </span>
                      </div>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">등록된 게시물이 없습니다.</p>
            {isOwner && (
              <Button className="mt-2">
                첫 게시물 작성하기
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunitySection;
