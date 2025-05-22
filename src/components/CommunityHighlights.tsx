import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

import { CATEGORIES, FEATURED, POSTS } from "@/data/communityMockData";
import { Category, FeaturedPost, Post } from "@/types/community-data";
import CommunitySidebar from "./community/CommunitySidebar";

const CommunityHighlights = () => {
  const [selectedCat, setSelectedCat] = useState<Category['value']>(CATEGORIES[0].value);

  return (
    <section className="w-full max-w-6xl mx-auto my-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* 좌: 인기 응원글 + 구독 급상승 */}
      <CommunitySidebar />

      {/* 우: 메인 게시글 */}
      <main className="md:col-span-3">
        {/* 카테고리 탭 */}
        <nav className="flex gap-4 mb-5">
          {CATEGORIES.map((cat: Category) => (
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
          {FEATURED.map((item: FeaturedPost) => (
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
          {POSTS.map((item: Post) => (
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
