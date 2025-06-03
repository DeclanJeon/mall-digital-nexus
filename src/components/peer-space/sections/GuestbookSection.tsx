import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, User } from 'lucide-react';

interface GuestbookEntry {
  id: string | number;
  author: string;
  message: string;
  date: string;
  profileImg: string;
}

interface GuestbookSectionProps {
  entries: GuestbookEntry[];
  onNavigateToSection?: (section: string) => void;
  showAll?: boolean;
}

const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  entries,
  onNavigateToSection,
  showAll = false
}) => {
  const displayedEntries = showAll ? entries : entries.slice(0, 3);

  return (
    <section className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">방명록</h2>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">방명록 남기기</h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <textarea 
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="방명록을 남겨보세요..."
              rows={4}
            ></textarea>
            <div className="mt-3 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                로그인하지 않은 경우 이름이 '익명'으로 표시됩니다.
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                방명록 남기기
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">모든 방명록</h3>
          <div className="space-y-4">
            {displayedEntries.map((entry) => (
              <Card key={entry.id} className="bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={entry.profileImg} 
                        alt={entry.author} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{entry.author}</h4>
                      <span className="text-sm text-gray-500">{entry.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{entry.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {!showAll && entries.length > 3 && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => onNavigateToSection?.('guestbook')}
              >
                더 보기
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestbookSection;
