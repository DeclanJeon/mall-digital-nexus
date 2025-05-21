
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-peermall-gray flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 bg-peermall-light-blue rounded-full flex items-center justify-center">
          <span className="text-5xl font-bold text-peermall-blue">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">
          요청하신 페이지가 존재하지 않거나 접근 권한이 없습니다.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-peermall-blue text-white font-medium px-5 py-2.5 rounded-lg hover:bg-peermall-dark-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
