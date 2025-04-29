
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface CreatePeermallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (peermallData: { name: string; type: string; description: string; id: string }) => void;
}

// Function to save peermall to local storage
const savePeermallToStorage = (peermallData: any) => {
  try {
    // Get existing peermalls from localStorage
    const existingPeermalls = JSON.parse(localStorage.getItem('peermalls') || '[]');
    
    // Add new peermall
    existingPeermalls.push(peermallData);
    
    // Save back to localStorage
    localStorage.setItem('peermalls', JSON.stringify(existingPeermalls));
    
    // Also save the individual peermall config
    const key = `peer_space_${peermallData.id}_config`;
    
    // Create default configuration for the new peer space
    const config = {
      id: peermallData.id,
      title: peermallData.title,
      description: peermallData.description,
      owner: '나',
      peerNumber: `P-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      profileImage: peermallData.imageUrl || 'https://api.dicebear.com/7.x/personas/svg?seed=' + peermallData.id,
      badges: [],
      followers: 0,
      recommendations: 0,
      level: 1,
      experience: 0,
      nextLevelExperience: 100,
      isVerified: false,
      skin: 'default',
      sections: ['hero', 'content', 'community', 'events', 'reviews', 'infoHub', 'map', 'trust', 'relatedMalls', 'activityFeed', 'liveCollaboration'],
      customizations: {
        primaryColor: '#71c4ef',
        secondaryColor: '#3B82F6',
        showChat: true,
        allowComments: true,
        showBadges: true,
      },
      location: peermallData.location || {
        lat: 37.5665,
        lng: 126.9780,
        address: 'Seoul, South Korea'
      }
    };
    
    localStorage.setItem(key, JSON.stringify(config));
    
    return true;
  } catch (error) {
    console.error('Failed to save peermall:', error);
    return false;
  }
};

const CreatePeermallModal: React.FC<CreatePeermallModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [peermallName, setPeermallName] = useState('');
  const [peermallType, setPeermallType] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    if (!peermallName || !peermallType) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "피어몰 이름과 타입은 필수 입력 항목입니다.",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Generate a unique ID for the peermall
    const peermallId = `peermall-${Date.now()}`;
    
    // Create peermall object
    const peermallData = {
      id: peermallId,
      title: peermallName,
      type: peermallType,
      description: description,
      owner: '나',
      category: category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      rating: 0,
      reviewCount: 0,
      imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${peermallId}`,
      featured: false,
      feedDate: new Date().toISOString(),
    };
    
    // Save peermall data to localStorage
    const success = savePeermallToStorage(peermallData);
    
    if (success) {
      toast({
        title: "피어몰 생성 완료",
        description: "새로운 피어몰이 생성되었습니다.",
      });
      
      // Reset form
      setPeermallName('');
      setPeermallType('');
      setDescription('');
      setCategory('');
      setTags('');
      setStep(1);
      
      // Close modal
      onClose();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess({
          name: peermallName,
          type: peermallType,
          description: description,
          id: peermallId
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "피어몰 생성 중 오류가 발생했습니다.",
      });
    }
    
    setIsSubmitting(false);
  };
  
  const handleClose = () => {
    setPeermallName('');
    setPeermallType('');
    setDescription('');
    setCategory('');
    setTags('');
    setStep(1);
    onClose();
  };
  
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="peermall-name">피어몰 이름</Label>
              <Input
                id="peermall-name"
                value={peermallName}
                onChange={(e) => setPeermallName(e.target.value)}
                placeholder="피어몰 이름을 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="peermall-type">피어몰 타입</Label>
              <Select value={peermallType} onValueChange={setPeermallType}>
                <SelectTrigger>
                  <SelectValue placeholder="타입을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commerce">커머스</SelectItem>
                  <SelectItem value="service">서비스</SelectItem>
                  <SelectItem value="community">커뮤니티</SelectItem>
                  <SelectItem value="portfolio">포트폴리오</SelectItem>
                  <SelectItem value="blog">블로그</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="피어몰에 대한 간단한 설명을 입력하세요"
              />
            </div>
            
            <Button onClick={() => setStep(2)} className="w-full">
              다음 단계
            </Button>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">패션</SelectItem>
                  <SelectItem value="electronics">전자기기</SelectItem>
                  <SelectItem value="food">음식</SelectItem>
                  <SelectItem value="beauty">뷰티</SelectItem>
                  <SelectItem value="hobby">취미</SelectItem>
                  <SelectItem value="digital">디지털</SelectItem>
                  <SelectItem value="art">예술</SelectItem>
                  <SelectItem value="education">교육</SelectItem>
                  <SelectItem value="travel">여행</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="예: #디자인, #푸드, #패션"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                이전 단계
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "생성 중..." : "피어몰 생성하기"}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>피어몰 만들기</DialogTitle>
          <DialogDescription>
            내 제품, 서비스, 콘텐츠를 공유할 수 있는 피어몰을 생성합니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-primary' : 'bg-gray-200'}`}>
              <span className={`text-sm ${step === 1 ? 'text-white' : 'text-gray-600'}`}>1</span>
            </div>
            <div className="h-1 w-16 bg-gray-200">
              <div className={`h-1 bg-primary ${step >= 2 ? 'w-full' : 'w-0'} transition-all`}></div>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-primary' : 'bg-gray-200'}`}>
              <span className={`text-sm ${step === 2 ? 'text-white' : 'text-gray-600'}`}>2</span>
            </div>
          </div>
        </div>
        
        {renderStep()}
        
        <DialogFooter className="sm:justify-start">
          <div className="w-full text-xs text-gray-500">
            피어몰을 생성하면 PeerMall의 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePeermallModal;
