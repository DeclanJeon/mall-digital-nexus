import { Badge } from "@/components/ui/badge";
import { ContentType } from "./types";

interface ContentBadgeProps {
  type: ContentType;
}

const ContentBadge = ({ type }: ContentBadgeProps) => {
  const badgeConfig = {
    event: { text: '이벤트', className: 'bg-accent-100' },
    product: { text: '상품', className: 'bg-primary-200' },
    service: { text: '서비스', className: 'bg-secondary' }
  };

  return (
    <Badge className={`absolute top-2 right-2 ${badgeConfig[type].className}`}>
      {badgeConfig[type].text}
    </Badge>
  );
};

export default ContentBadge;
