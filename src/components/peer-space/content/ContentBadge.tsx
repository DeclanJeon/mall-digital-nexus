
import { Badge } from "@/components/ui/badge";
import { ContentType } from "../types";

interface ContentBadgeProps {
  type: ContentType | string;
}

export default function ContentBadge({ type }: ContentBadgeProps) {
  // Create a mapping for content types
  const badgeConfig: Record<string, { text: string; className: string }> = {
    [ContentType.Product]: { text: '상품', className: 'bg-primary-200' },
    [ContentType.Portfolio]: { text: '포트폴리오', className: 'bg-accent-200' },
    [ContentType.Service]: { text: '서비스', className: 'bg-secondary' },
    [ContentType.Event]: { text: '이벤트', className: 'bg-accent-100' },
    [ContentType.Post]: { text: '게시글', className: 'bg-slate-200' },
    [ContentType.Review]: { text: '리뷰', className: 'bg-orange-100' },
    [ContentType.Quest]: { text: '퀘스트', className: 'bg-purple-100' },
    [ContentType.Advertisement]: { text: '광고', className: 'bg-red-100' },
    [ContentType.Stream]: { text: '스트림', className: 'bg-blue-100' },
    [ContentType.Guestbook]: { text: '방명록', className: 'bg-green-100' },
    [ContentType.Course]: { text: '강의', className: 'bg-yellow-100' },
    [ContentType.Workshop]: { text: '워크숍', className: 'bg-indigo-100' },
    [ContentType.Challenge]: { text: '챌린지', className: 'bg-pink-100' },
    [ContentType.Tool]: { text: '도구', className: 'bg-gray-100' },
    [ContentType.External]: { text: '외부', className: 'bg-gray-300' },
    [ContentType.Livestream]: { text: '라이브 스트림', className: 'bg-blue-200' },
    [ContentType.Article]: { text: '아티클', className: 'bg-green-200' },
    [ContentType.Resource]: { text: '리소스', className: 'bg-yellow-200' },
    [ContentType.Other]: { text: '기타', className: 'bg-gray-200' },
    'portfolio': { text: '포트폴리오', className: 'bg-accent-200' },
    'product': { text: '상품', className: 'bg-primary-200' },
    'service': { text: '서비스', className: 'bg-secondary' },
    'event': { text: '이벤트', className: 'bg-accent-100' },
    'post': { text: '게시글', className: 'bg-slate-200' }
  };

  // Use the mapping or default to a generic badge if type is not found
  const config = badgeConfig[type] || { text: type as string, className: 'bg-gray-200' };

  return (
    <Badge className={`${config.className}`}>
      {config.text}
    </Badge>
  );
}
