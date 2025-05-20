import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

// 샘플 카테고리
const CATEGORIES = [
  { label: "여행·맛집", value: "travel" },
  { label: "리빙·스타일", value: "living" },
  { label: "가족·연애", value: "family" },
  { label: "직장·자기계발", value: "job" },
  { label: "시사·지식", value: "issue" },
];

// 샘플 데이터
const FEATURED = [
  {
    id: 1,
    title: "차 싣고 제주도 가는 법 배편 예약부터 요금, 탐승, 항구까지 제주도 여행 총정리",
    thumb: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    summary: "푸른 바다와 아름다운 자연경관을 자랑하는 제주도. 한동안 조용했던 제주가 다시 관광객들로 붐비고 있다...",
    category: "여행·맛집",
    likes: 22,
    comments: 19,
    date: "5일 전"
  },
  {
    id: 2,
    title: "눈으로 먼저 반하는 더맑은초가랑 19첩반상! 제대로 맛보고 왔어요",
    thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    summary: "친구들과 천상의 정원을 관람한 후 점심을 먹기 위해 검색해서 간 곳이 더 맑은 초가랑이에요...",
    category: "여행·맛집",
    likes: 28,
    comments: 20,
    date: "1일 전"
  }
];

const POSTS = [
  {
    id: 3,
    title: "가족 외식하기 좋은 용건점 한정식 밥상천하 다녀왔습니다.",
    thumb: "https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&w=400&q=80",
    summary:
      "지난 10일 토요일 아버지 생신으로 동생네랑 가까운 곳에 계신 친척까지 모여서 밥 먹을 곳을 찾아봤습니다...",
    author: "담덕의 탐방일지",
    category: "가족·연애",
    likes: 53,
    comments: 25,
    date: "2일 전",
  },
  {
    id: 4,
    title: "다이소-로마 말키스트 코코넛맛 비스킷",
    thumb: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    summary: "로마- 말키스트 코코넛맛 비스킷! 다이소에서는 가성비 넘치는 동남아 간식 체험을 할 수 있다네요...",
    author: "리뷰하는 강아지",
    category: "리빙·스타일",
    likes: 13,
    comments: 2,
    date: "4일 전",
  }
];

// 인기 응원글
const RECOMMENDED = [
  {
    id: 101,
    title: "백종원 논란으로 연돈 가맹주들과 갈등, 맥도날드 사태와 비슷하다?",
    author: "청강",
    likes: 12,
    comments: 8,
    thumb: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=200&q=80",
    label: "송돌송돌님 등 2명 응원",
  },
  {
    id: 102,
    title: "(광고X)마성 진남교반 카페 Groche 그로체 방문 후기",
    author: "니나와 함께",
    likes: 6,
    comments: 3,
    thumb: "https://images.unsplash.com/photo-1533777857889-4be7b20b8743?auto=format&fit=crop&w=200&q=80",
    label: "지금 응원해 주세요!",
  },
  {
    id: 103,
    title: "대선 TV토론 '팩트체크 전쟁'에서 우리가 진짜 봐야 할 5가지 핵심",
    author: "경제독립을 위하여",
    likes: 7,
    comments: 2,
    thumb: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
    label: "지금 응원해 주세요!",
  },
  {
    id: 104,
    title: "클릭당 최대 $3.5 수익? 2025년 고단가 키워드 리스트 공개 / 단가 높은 키워드 TOP7...",
    author: "디지털 노마드 실험실",
    likes: 9,
    comments: 1,
    thumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    label: "지금 응원해 주세요!",
  }
];

// 구독 급상승
const SUBS_RISING = {
  name: "노병의 맛집 기행",
  desc: "노병 이흥규의 블로그입니다. 맛집, 여행, 일상의 이야기를 주제로 운영 합니다.",
  subs: 703,
  rising: 42,
  posts: [
    {
      id: 201,
      title: "서울에서 제일 오래된 전통의 중화요리 노포...",
      thumb: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 202,
      title: "1초호수변 정통중식당 / 일일횡 잠실점",
      thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80",
    }
  ],
  page: 6,
  total: 20
}

const CommunityHighlights = () => {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].value);

  return (
    <section className="w-full max-w-6xl mx-auto my-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* 좌: 인기 응원글 + 구독 급상승 */}
      <aside className="md:col-span-1 flex flex-col gap-8">
        {/* 인기 응원글 */}
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center">인기 응원글<span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">🔥</span></h3>
          <ul className="space-y-3">
            {RECOMMENDED.map((item, idx) => (
              <li key={item.id} className="flex gap-2 items-start group">
                <div className="flex flex-col items-center mt-1">
                  <span className="text-xs text-pink-500 font-bold">{item.label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/community/post/${item.id}`} className="font-medium hover:text-accent-200 block truncate">
                    {item.title}
                  </Link>
                  <div className="flex items-center text-xs gap-2 mt-1">
                    <span className="text-gray-500">{item.author}</span>
                  </div>
                </div>
                <img src={item.thumb} alt={item.title} className="w-12 h-12 object-cover rounded-md ml-2" />
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-3 text-gray-500 text-sm items-center gap-2">
            <ChevronLeft className="h-4 w-4" /> 1 / 2 <ChevronRight className="h-4 w-4" />
          </div>
        </div>
        {/* 구독 급상승 */}
        <div>
          <h3 className="font-bold text-lg mb-2 flex items-center">구독 급상승<span className="ml-2 text-pink-500 text-lg">🎉</span></h3>
          <div className="rounded-xl shadow bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900 text-white p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{SUBS_RISING.subs}명 구독</span>
              <span className="font-semibold text-pink-300">+{SUBS_RISING.rising}명</span>
            </div>
            <div className="font-bold text-lg mb-1">{SUBS_RISING.name}</div>
            <div className="text-xs mb-2 text-gray-200">{SUBS_RISING.desc}</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {SUBS_RISING.posts.map(p => (
                <div key={p.id} className="rounded bg-gray-700 hover:bg-gray-800 p-2 flex flex-col">
                  <img src={p.thumb} alt={p.title} className="w-full h-16 object-cover rounded mb-1" />
                  <span className="text-xs truncate">{p.title}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs text-gray-300">
              <span>{SUBS_RISING.page} / {SUBS_RISING.total}</span>
              <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600 font-bold">+ 구독</Button>
            </div>
          </div>
        </div>
      </aside>

      {/* 우: 메인 게시글 */}
      <main className="md:col-span-3">
        {/* 카테고리 탭 */}
        <nav className="flex gap-4 mb-5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCat(cat.value)}
              className={`font-semibold pb-1 border-b-2 ${cat.value === selectedCat ? "border-accent-200 text-accent-200" : "border-transparent text-gray-500 hover:text-accent-200"}`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
        {/* 상단 추천/베스트 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {FEATURED.map(item => (
            <Link to={`/community/post/${item.id}`} key={item.id} className="block group">
              <div className="rounded-xl shadow hover:shadow-xl overflow-hidden bg-white">
                <img src={item.thumb} alt={item.title} className="w-full h-40 object-cover group-hover:scale-105 transition" />
                <div className="p-4">
                  <div className="text-sm font-bold text-gray-700 mb-2">{item.category}</div>
                  <h4 className="font-bold text-xl truncate mb-2 group-hover:text-accent-200">{item.title}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.summary}</p>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{item.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{item.comments}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* 리스트형 최신글 */}
        <div className="divide-y divide-gray-100">
          {POSTS.map(item => (
            <div key={item.id} className="flex py-5 gap-3 items-start hover:bg-gray-50 transition">
              <div className="flex-1">
                <Link to={`/community/post/${item.id}`} className="font-semibold text-lg truncate hover:text-accent-200">{item.title}</Link>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.summary}</p>
                <div className="flex gap-3 text-xs text-gray-400 mt-2">
                  <span>{item.author}</span>
                  <span>{item.category}</span>
                  <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{item.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{item.comments}</span>
                  <span>{item.date}</span>
                </div>
              </div>
              <img src={item.thumb} alt={item.title} className="w-24 h-20 object-cover rounded-lg shadow" />
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default CommunityHighlights;
