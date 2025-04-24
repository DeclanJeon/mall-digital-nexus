import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Plus, ArrowRight, Heart, MessageSquare, Eye, 
  Bookmark, ExternalLink, Star 
} from 'lucide-react';

import { PeerMallConfig, Content } from './types';

interface PeerSpaceContentSectionProps {
  config: PeerMallConfig;
  contents: Content[];
  isOwner: boolean;
  onAddContent: () => void;
}

const PeerSpaceContentSection: React.FC<PeerSpaceContentSectionProps> = ({
  config,
  contents,
  isOwner,
  onAddContent
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const contentTypes = [
    { id: 'all', label: '전체' },
    { id: 'portfolio', label: '포트폴리오' },
    { id: 'product', label: '상품' },
    { id: 'service', label: '서비스' },
    { id: 'post', label: '게시글' },
    { id: 'review', label: '리뷰' },
  ];

  // Filter contents based on active tab
  const filteredContents = activeTab === 'all' 
    ? contents 
    : contents.filter(content => content.type === activeTab);

  // Calculate display count or default to 4 if not specified
  const displayCount = config.customizations.contentDisplayCount?.content || 4;

  const handleContentClick = (content: Content) => {
    if (content.isExternal && content.externalUrl) {
      window.open(content.externalUrl, '_blank');
    }
    // Otherwise handle internal content view
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">콘텐츠 및 상품</h2>
        
        {isOwner && (
          <Button onClick={onAddContent} className="text-sm">
            <Plus className="h-4 w-4 mr-1" /> 콘텐츠 추가
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100">
          {contentTypes.map(type => (
            <TabsTrigger 
              key={type.id} 
              value={type.id}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredContents.slice(0, displayCount).map(content => (
              <Card 
                key={content.id} 
                className="overflow-hidden group cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleContentClick(content)}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={content.imageUrl || 'https://via.placeholder.com/400x300'} 
                    alt={content.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {content.isExternal && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 bg-black/50 text-white text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {content.source}
                    </Badge>
                  )}

                  {content.price && (
                    <Badge 
                      className="absolute bottom-2 left-2 bg-blue-500 text-white border-none"
                    >
                      {content.price}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-blue-500 transition-colors">
                    {content.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 h-10">
                    {content.description}
                  </p>
                  
                  {content.rating !== undefined && (
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3.5 w-3.5 ${
                            i < (content.rating || 0) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-3 border-t flex justify-between bg-gray-50">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {content.likes !== undefined && (
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" /> {content.likes}
                      </span>
                    )}
                    {content.comments !== undefined && (
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" /> {content.comments}
                      </span>
                    )}
                    {content.views !== undefined && (
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" /> {content.views}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => { 
                        e.stopPropagation();
                        // Handle bookmark save logic
                      }}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredContents.length > displayCount && (
            <div className="mt-6 text-center">
              <Button variant="outline" className="mx-auto">
                더 보기 <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default PeerSpaceContentSection;
