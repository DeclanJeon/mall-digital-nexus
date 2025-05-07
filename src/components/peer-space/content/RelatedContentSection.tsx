
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Content } from './types';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RelatedContentSectionProps {
  contents: Content[];
  baseUrl: string;
}

const RelatedContentSection: React.FC<RelatedContentSectionProps> = ({ contents, baseUrl }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">관련 콘텐츠</CardTitle>
      </CardHeader>
      <CardContent>
        {contents.length > 0 ? (
          <div className="space-y-3">
            {contents.map(content => (
              <Link 
                key={content.id} 
                to={`${baseUrl}/${content.id}`}
                className="flex items-start p-2 hover:bg-gray-50 rounded-md transition-colors group"
              >
                <div className="w-12 h-12 shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
                  <img 
                    src={content.imageUrl} 
                    alt={content.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h5 className="font-medium text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {content.title}
                  </h5>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {content.description}
                  </p>
                </div>
                {content.isExternal ? (
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors" />
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>관련 콘텐츠가 없습니다</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedContentSection;
