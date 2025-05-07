
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export interface GuestbookEntry {
  id: string;
  author: string;
  authorImage?: string;
  content: string;
  rating?: number;
  date: string;
  type: 'guestbook' | 'review';
  productId?: string;
  productName?: string;
}

interface GuestbookSectionProps {
  peerAddress: string;
  isOwner: boolean;
}

const GuestbookSection: React.FC<GuestbookSectionProps> = ({ peerAddress, isOwner }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entryType, setEntryType] = useState<'guestbook' | 'review'>('guestbook');
  const [rating, setRating] = useState(5);
  const [productName, setProductName] = useState('');
  
  // Mock username - in a real app, this would come from authentication
  const username = localStorage.getItem('peerspace_username') || getRandomAnimalName();
  
  useEffect(() => {
    // Load entries from localStorage
    const storedEntries = localStorage.getItem(`peerspace_guestbook_${peerAddress}`);
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    } else {
      // Initialize with some sample entries
      const sampleEntries: GuestbookEntry[] = [
        {
          id: '1',
          author: '김디자이너',
          authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=KimDesigner',
          content: '콘텐츠의 질이 정말 좋아요. 다양한 주제를 다루는 점이 특히 마음에 듭니다.',
          date: '3일 전',
          type: 'guestbook'
        },
        {
          id: '2',
          author: '이고객',
          authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=LeeCustomer',
          content: '친환경 면 티셔츠 정말 만족스럽습니다. 소재가 부드럽고 착용감이 좋아요.',
          rating: 5,
          date: '1주일 전',
          type: 'review',
          productId: 'product1',
          productName: '친환경 면 티셔츠'
        }
      ];
      setEntries(sampleEntries);
      localStorage.setItem(`peerspace_guestbook_${peerAddress}`, JSON.stringify(sampleEntries));
    }
  }, [peerAddress]);
  
  const saveEntries = (updatedEntries: GuestbookEntry[]) => {
    localStorage.setItem(`peerspace_guestbook_${peerAddress}`, JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };
  
  const handleAddEntry = () => {
    if (newEntry.trim()) {
      const now = new Date();
      
      const entry: GuestbookEntry = {
        id: `entry-${Date.now()}`,
        author: username,
        authorImage: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
        content: newEntry,
        date: '방금 전',
        type: entryType
      };
      
      if (entryType === 'review') {
        entry.rating = rating;
        entry.productId = `product-${Date.now()}`;
        entry.productName = productName || '제품';
      }
      
      const updatedEntries = [entry, ...entries];
      saveEntries(updatedEntries);
      
      setNewEntry('');
      setProductName('');
      setRating(5);
      setIsDialogOpen(false);
      
      toast({
        title: entryType === 'guestbook' ? "방명록 등록 완료" : "리뷰 등록 완료",
        description: "소중한 의견 감사합니다.",
      });
    }
  };
  
  const handleRemoveEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    saveEntries(updatedEntries);
    
    toast({
      title: "삭제 완료",
      description: "선택한 항목이 삭제되었습니다.",
    });
  };
  
  function getRandomAnimalName() {
    const animals = ['토끼', '사자', '호랑이', '기린', '코끼리', '팬더', '곰', '여우', '늑대', '사슴'];
    const randomIndex = Math.floor(Math.random() * animals.length);
    return `익명 ${animals[randomIndex]}`;
  }
  
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">리뷰 & 방명록</h2>
        <Button onClick={() => setIsDialogOpen(true)}>작성하기</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {entries.length === 0 ? (
          <Card className="text-center p-8">
            <p>등록된 리뷰/방명록이 없습니다.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              첫 방명록 남기기
            </Button>
          </Card>
        ) : (
          entries.map(entry => (
            <Card key={entry.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={entry.authorImage} />
                      <AvatarFallback>{entry.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{entry.author}</div>
                      <div className="text-xs text-gray-500">{entry.date}</div>
                    </div>
                  </div>
                  {entry.type === 'review' && entry.rating && (
                    <div className="flex">
                      {renderStars(entry.rating)}
                    </div>
                  )}
                </div>
                {entry.type === 'review' && entry.productName && (
                  <div className="mt-2 text-sm text-gray-500">
                    제품: {entry.productName}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p>{entry.content}</p>
              </CardContent>
              {isOwner && (
                <CardFooter className="pt-0 justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveEntry(entry.id)}
                  >
                    삭제
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>리뷰 & 방명록 작성</DialogTitle>
          </DialogHeader>
          
          <div className="flex mb-4">
            <Button
              variant={entryType === 'guestbook' ? 'default' : 'outline'}
              className="flex-1 rounded-r-none"
              onClick={() => setEntryType('guestbook')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              방명록
            </Button>
            <Button
              variant={entryType === 'review' ? 'default' : 'outline'}
              className="flex-1 rounded-l-none"
              onClick={() => setEntryType('review')}
            >
              <Star className="h-4 w-4 mr-2" />
              리뷰
            </Button>
          </div>
          
          {entryType === 'review' && (
            <>
              <div>
                <label htmlFor="product" className="block text-sm font-medium mb-1">제품명</label>
                <Input 
                  id="product"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="리뷰를 작성할 제품명을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">평점</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              {entryType === 'guestbook' ? '메시지' : '리뷰 내용'}
            </label>
            <Textarea 
              id="content"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder={entryType === 'guestbook' ? '방명록 메시지를 입력하세요' : '리뷰 내용을 입력하세요'}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
            <Button onClick={handleAddEntry}>등록</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GuestbookSection;
