import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RECOMMENDED, SUBS_RISING } from "@/data/communityMockData";

const CommunitySidebar = () => {
  return (
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
  );
};

export default CommunitySidebar;