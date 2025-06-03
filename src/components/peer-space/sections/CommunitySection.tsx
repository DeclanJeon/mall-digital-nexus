import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Content } from '@/types/space';
import { FileText, Heart, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
      
      <div className="p-6 border-b bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-indigo-50/80 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25"
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            <MessageSquare className="w-6 h-6 text-white" /> {/* 💬 통일된 아이콘 */}
          </motion.div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              💬 커뮤니티
            </h2>
            <p className="text-gray-600 font-medium text-sm">소통과 나눔의 공간</p>
          </div>
        </div>
        {!showAll && posts.length > 3 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onNavigateToSection?.('community')}
            className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600"
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
