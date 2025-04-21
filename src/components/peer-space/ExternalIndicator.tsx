import { ExternalLink } from "lucide-react";

interface ExternalIndicatorProps {
  source?: string;
}

const ExternalIndicator = ({ source }: ExternalIndicatorProps) => (
  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
    <ExternalLink className="h-3 w-3 mr-1" />
    외부 콘텐츠
    {source && <span className="ml-1">출처: {source}</span>}
  </div>
);

export default ExternalIndicator;
