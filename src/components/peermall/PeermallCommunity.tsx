
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';

interface PeermallCommunityProps {
  peermall: any;
}

const PeermallCommunity: React.FC<PeermallCommunityProps> = ({ peermall }) => {
  return (
    <div>
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">커뮤니티</h2>
        <p className="text-lg text-text-200 max-w-3xl mx-auto">
          최신 소식, 인테리어 팁, 그리고 다양한 디자인 아이디어를 만나보세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {peermall.posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div className="relative h-60 overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
                <span className="text-white text-xs font-medium px-2 py-1 bg-accent-200/80 rounded-full">
                  {post.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-text-200 text-sm mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{post.date}</span>
                </div>
              </div>
              <Button 
                variant="link" 
                className="text-accent-200 hover:text-accent-100 p-0"
              >
                자세히 보기
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-12 border-t">
        <h3 className="text-2xl font-bold mb-8 text-center">고객 후기</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {peermall.testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <svg className="h-6 w-6 text-accent-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-text-200 mb-6 flex-grow">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeermallCommunity;
