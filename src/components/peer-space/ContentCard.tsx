import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Content } from "./types";
import ContentBadge from "./ContentBadge";
import ExternalIndicator from "./ExternalIndicator";
import { Star, Clock, Users, CheckCircle } from "lucide-react";

interface ContentCardProps {
  content: Content;
  onClick?: (content: Content) => void;
}

export default function ContentCard({ content, onClick }: ContentCardProps) {
  // Determine if we should show completion indicator
  const hasCompletion = content.completion !== undefined;
  
  // Determine if we should show participants info
  const hasParticipants = content.participants !== undefined && content.maxParticipants !== undefined;
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-[#f5f4f1] border-[#cccbc8]" 
      onClick={() => onClick?.(content)}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={content.imageUrl}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </AspectRatio>
        <div className="absolute top-3 left-3 z-10">
          <ContentBadge type={content.type} />
        </div>
        
        {content.isExternal && content.source && (
          <div className="absolute top-3 right-3 z-10">
            <ExternalIndicator source={content.source} />
          </div>
        )}
        
        {hasCompletion && (
          <div className="absolute bottom-3 right-3 z-10">
            <Badge variant="default" className="bg-[#00668c] text-[#fffefb] gap-1 px-2.5 py-1">
              <CheckCircle className="h-3 w-3" />
              {content.completion}% Complete
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold mb-1 text-[#1d1c1c] text-lg line-clamp-1">{content.title}</h3>
        <p className="text-sm text-[#313d44] mb-3 line-clamp-2">{content.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {content.price && (
              <span className="font-semibold text-[#00668c]">{content.price}</span>
            )}
            {content.date && content.date !== '' && !content.price && (
              <div className="flex items-center gap-1 text-sm text-[#313d44]">
                <Clock className="h-3.5 w-3.5" />
                <span>{content.date}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            {hasParticipants && (
              <div className="text-sm text-[#313d44] flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{content.participants}/{content.maxParticipants}</span>
              </div>
            )}
            
            <div className="text-sm text-[#313d44] flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400" />
              <span>{content.likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
