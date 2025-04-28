
import { Badge } from "@/components/ui/badge";

interface ExternalIndicatorProps {
  source: string;
}

export default function ExternalIndicator({ source }: ExternalIndicatorProps) {
  return (
    <Badge 
      variant="outline"
      className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm"
    >
      {source}
    </Badge>
  );
}
