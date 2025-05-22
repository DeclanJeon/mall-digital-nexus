// src/data/communityMockData.ts

import {
  Category,
  FeaturedPost,
  Post,
  RecommendedPost,
  SubsRising,
  SubRisingPost,
} from '@/types/community-data';

export const CATEGORIES: Category[] = [
  { label: '여행·맛집', value: 'travel' },
  { label: '리빙·스타일', value: 'living' },
  { label: '가족·연애', value: 'family' },
  { label: '직장·자기계발', value: 'job' },
  { label: '시사·지식', value: 'issue' },
];

export const FEATURED: FeaturedPost[] = [
  {
    id: 1,
    title:
      '차 싣고 제주도 가는 법 배편 예약부터 요금, 탐승, 항구까지 제주도 여행 총정리',
    thumb:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    summary:
      '푸른 바다와 아름다운 자연경관을 자랑하는 제주도. 한동안 조용했던 제주가 다시 관광객들로 붐비고 있다...',
    category: '여행·맛집',
    likes: 22,
    comments: 19,
    date: '5일 전',
  },
  {
    id: 2,
    title: '눈으로 먼저 반하는 더맑은초가랑 19첩반상! 제대로 맛보고 왔어요',
    thumb:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    summary:
      '친구들과 천상의 정원을 관람한 후 점심을 먹기 위해 검색해서 간 곳이 더 맑은 초가랑이에요...',
    category: '여행·맛집',
    likes: 28,
    comments: 20,
    date: '1일 전',
  },
];

export const POSTS: Post[] = [
  {
    id: 3,
    title: '가족 외식하기 좋은 용건점 한정식 밥상천하 다녀왔습니다.',
    thumb:
      'https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&w=400&q=80',
    summary:
      '지난 10일 토요일 아버지 생신으로 동생네랑 가까운 곳에 계신 친척까지 모여서 밥 먹을 곳을 찾아봤습니다...',
    author: '담덕의 탐방일지',
    category: '가족·연애',
    likes: 53,
    comments: 25,
    date: '2일 전',
  },
  {
    id: 4,
    title: '다이소-로마 말키스트 코코넛맛 비스킷',
    thumb:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    summary:
      '로마- 말키스트 코코넛맛 비스킷! 다이소에서는 가성비 넘치는 동남아 간식 체험을 할 수 있다네요...',
    author: '리뷰하는 강아지',
    category: '리빙·스타일',
    likes: 13,
    comments: 2,
    date: '4일 전',
  },
];

export const RECOMMENDED: RecommendedPost[] = [
  {
    id: 101,
    title: '백종원 논란으로 연돈 가맹주들과 갈등, 맥도날드 사태와 비슷하다?',
    author: '청강',
    likes: 12,
    comments: 8,
    thumb:
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=200&q=80',
    label: '송돌송돌님 등 2명 응원',
  },
  {
    id: 102,
    title: '(광고X)마성 진남교반 카페 Groche 그로체 방문 후기',
    author: '니나와 함께',
    likes: 6,
    comments: 3,
    thumb:
      'https://images.unsplash.com/photo-1533777857889-4be7b20b8743?auto=format&fit=crop&w=200&q=80',
    label: '지금 응원해 주세요!',
  },
  {
    id: 103,
    title: "대선 TV토론 '팩트체크 전쟁'에서 우리가 진짜 봐야 할 5가지 핵심",
    author: '경제독립을 위하여',
    likes: 7,
    comments: 2,
    thumb:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80',
    label: '지금 응원해 주세요!',
  },
  {
    id: 104,
    title:
      '클릭당 최대 $3.5 수익? 2025년 고단가 키워드 리스트 공개 / 단가 높은 키워드 TOP7...',
    author: '디지털 노마드 실험실',
    likes: 9,
    comments: 1,
    thumb:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
    label: '지금 응원해 주세요!',
  },
];

export const SUBS_RISING: SubsRising = {
  name: '노병의 맛집 기행',
  desc: '노병 이흥규의 블로그입니다. 맛집, 여행, 일상의 이야기를 주제로 운영 합니다.',
  subs: 703,
  rising: 42,
  posts: [
    {
      id: 201,
      title: '서울에서 제일 오래된 전통의 중화요리 노포...',
      thumb:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 202,
      title: '1초호수변 정통중식당 / 일일횡 잠실점',
      thumb:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
    },
  ],
  page: 6,
  total: 20,
};
