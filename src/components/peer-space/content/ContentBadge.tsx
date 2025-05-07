
import { Badge } from "@/components/ui/badge";
import { ContentType } from "./types";

interface ContentBadgeProps {
  type: ContentType;
}

export default function ContentBadge({ type }: ContentBadgeProps) {
  // Create a mapping for all possible ContentType values
  const badgeConfig: Record<ContentType, { text: string; className: string }> = {
    product: { text: '상품', className: 'bg-primary-200' },
    portfolio: { text: '포트폴리오', className: 'bg-accent-200' },
    service: { text: '서비스', className: 'bg-secondary' },
    event: { text: '이벤트', className: 'bg-accent-100' },
    post: { text: '게시글', className: 'bg-slate-200' },
    review: { text: '리뷰', className: 'bg-orange-100' },
    quest: { text: '퀘스트', className: 'bg-purple-100' },
    advertisement: { text: '광고', className: 'bg-red-100' },
    stream: { text: '스트림', className: 'bg-blue-100' },
    guestbook: { text: '방명록', className: 'bg-green-100' },
    course: { text: '강의', className: 'bg-yellow-100' },
    workshop: { text: '워크숍', className: 'bg-indigo-100' },
    challenge: { text: '챌린지', className: 'bg-pink-100' },
    tool: { text: '도구', className: 'bg-gray-100' },
    external: { text: '외부', className: 'bg-gray-300' },
    livestream: { text: '라이브 스트림', className: 'bg-blue-200' }
  };

  // Use the mapping or default to product if type is not found
  const config = badgeConfig[type] || { text: type, className: 'bg-gray-200' };

  return (
    <Badge className={`${config.className}`}>
      {config.text}
    </Badge>
  );
}
