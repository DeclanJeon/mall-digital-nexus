import { Card, CardContent } from "@/components/ui/card";
import { Content } from "./types";
import ContentBadge from "./ContentBadge.tsx";
import ExternalIndicator from "./ExternalIndicator";
import { Star } from "lucide-react";

interface ContentCardProps {
  content: Content;
  onClick?: () => void;
}

export default function ContentCard({ content, onClick }: ContentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="aspect-video relative overflow-hidden">
        <img
          src={content.imageUrl}
          alt={content.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <ContentBadge type={content.type} />
        {content.isExternal && <ExternalIndicator source={content.source} />}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold mb-1">{content.title}</h3>
        <p className="text-sm text-text-200 mb-3">{content.description}</p>
        <div className="flex justify-between items-center">
          <div>
            {content.price && <p className="font-semibold text-primary-300">{content.price}</p>}
            {content.date && content.date !== '' && !content.price && (
              <p className="text-sm text-text-200">{content.date}</p>
            )}
          </div>
          <div className="text-sm text-text-200 flex items-center">
            <Star className="h-3 w-3 text-yellow-400 mr-1" />
            {content.likes}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
