
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanetType } from './types';
import { CirclePlus, CircleCheck, ArrowRight, Calendar, Lock, Globe, Clock } from 'lucide-react';

interface PlanetCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlanet: (planetData: any) => void;
}

const planetTemplates = [
  {
    name: '공개 커뮤니티',
    description: '누구나 참여할 수 있는 공개 커뮤니티',
    type: 'public' as PlanetType,
    color: '#3e9bff',
    icon: <Globe className="h-5 w-5" />
  },
  {
    name: '비공개 커뮤니티',
    description: '초대 또는 승인을 통해서만 참여 가능한 비공개 커뮤니티',
    type: 'private' as PlanetType,
    color: '#4caf50',
    icon: <Lock className="h-5 w-5" />
  },
  {
    name: '기간 제한 이벤트',
    description: '특정 기간 동안만 운영되는 이벤트 또는 프로젝트 커뮤니티',
    type: 'timeLimited' as PlanetType,
    color: '#e91e63',
    icon: <Clock className="h-5 w-5" />
  }
];

const PlanetCreationWizard: React.FC<PlanetCreationWizardProps> = ({ isOpen, onClose, onCreatePlanet }) => {
  const [step, setStep] = useState(1);
  const [planetData, setPlanetData] = useState({
    name: '',
    description: '',
    type: 'public' as PlanetType,
    topics: [] as string[],
    color: '#3e9bff',
    isPrivate: false,
    expiryDate: '',
    topic: '',
  });
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleFinish = () => {
    onCreatePlanet({
      ...planetData,
      id: `planet-${Date.now()}`,
      stage: 'asteroid',
      createdAt: new Date().toISOString(),
      members: 1,
      activities: 0,
      health: 100,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      size: 0.8 + Math.random() * 0.4, // Random size between 0.8 and 1.2
    });
    onClose();
    setStep(1);
    setPlanetData({
      name: '',
      description: '',
      type: 'public',
      topics: [],
      color: '#3e9bff',
      isPrivate: false,
      expiryDate: '',
      topic: '',
    });
  };
  
  const handleSelectTemplate = (template: any) => {
    setPlanetData({
      ...planetData,
      type: template.type,
      color: template.color,
      isPrivate: template.type === 'private'
    });
  };
  
  const addTopic = () => {
    if (planetData.topic && planetData.topics.length < 5) {
      setPlanetData({
        ...planetData,
        topics: [...planetData.topics, planetData.topic],
        topic: ''
      });
    }
  };
  
  const removeTopic = (index: number) => {
    const newTopics = [...planetData.topics];
    newTopics.splice(index, 1);
    setPlanetData({
      ...planetData,
      topics: newTopics
    });
  };
  
  const isStepValid = () => {
    switch (step) {
      case 1:
        return planetData.name.length >= 2;
      case 2:
        return planetData.description.length >= 10;
      case 3:
        return planetData.topics.length > 0;
      default:
        return true;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0c0c1d] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>새로운 행성 만들기 ({step}/4)</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s}
              className={`flex flex-col items-center ${s < step ? 'text-blue-400' : s === step ? 'text-white' : 'text-gray-500'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                s < step 
                  ? 'bg-blue-600' 
                  : s === step 
                    ? 'bg-blue-500' 
                    : 'bg-gray-700'
              }`}>
                {s < step ? (
                  <CircleCheck className="h-5 w-5" />
                ) : (
                  <span>{s}</span>
                )}
              </div>
              <span className="text-xs mt-1">
                {s === 1 && '기본 정보'}
                {s === 2 && '설명'}
                {s === 3 && '주제 설정'}
                {s === 4 && '확인'}
              </span>
            </div>
          ))}
        </div>
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">행성 이름</Label>
              <Input
                id="name"
                placeholder="행성 이름을 입력하세요"
                value={planetData.name}
                onChange={(e) => setPlanetData({ ...planetData, name: e.target.value })}
                className="bg-white/5 border-white/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label>행성 유형</Label>
              <div className="grid grid-cols-1 gap-3">
                {planetTemplates.map((template, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectTemplate(template)}
                    className={`p-4 rounded-md cursor-pointer border transition-all ${
                      planetData.type === template.type
                        ? 'bg-white/10 border-blue-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: template.color }}
                      >
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-400">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {planetData.type === 'timeLimited' && (
              <div className="space-y-2">
                <Label htmlFor="expiryDate">종료 날짜</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="expiryDate"
                    type="date"
                    value={planetData.expiryDate}
                    onChange={(e) => setPlanetData({ ...planetData, expiryDate: e.target.value })}
                    className="pl-10 bg-white/5 border-white/20"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Step 2: Description */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">행성 소개</Label>
              <Textarea
                id="description"
                placeholder="행성의 목적과 활동을 설명해주세요"
                value={planetData.description}
                onChange={(e) => setPlanetData({ ...planetData, description: e.target.value })}
                className="min-h-[150px] bg-white/5 border-white/20"
              />
              <p className="text-xs text-gray-400">최소 10자 이상 입력해주세요. ({planetData.description.length}/300)</p>
            </div>
            
            {/* Planet color picker */}
            <div className="space-y-2">
              <Label>행성 색상</Label>
              <div className="flex flex-wrap gap-3">
                {['#3e9bff', '#4caf50', '#e91e63', '#ff9800', '#9c27b0', '#607d8b'].map((color) => (
                  <div
                    key={color}
                    onClick={() => setPlanetData({ ...planetData, color })}
                    className={`w-8 h-8 rounded-full cursor-pointer ${planetData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0c0c1d]' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Topics */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>주제 태그 (최대 5개)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="주제 또는 태그 입력"
                  value={planetData.topic}
                  onChange={(e) => setPlanetData({ ...planetData, topic: e.target.value })}
                  className="flex-1 bg-white/5 border-white/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTopic();
                    }
                  }}
                />
                <Button 
                  onClick={addTopic}
                  disabled={!planetData.topic || planetData.topics.length >= 5}
                  variant="outline"
                >추가</Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {planetData.topics.map((topic, index) => (
                  <Badge key={index} className="px-3 py-1 bg-white/10 hover:bg-white/20">
                    {topic}
                    <button 
                      onClick={() => removeTopic(index)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
                
                {planetData.topics.length === 0 && (
                  <p className="text-sm text-gray-400">최소 하나 이상의 주제를 추가해주세요.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="font-bold text-lg mb-2">행성 미리보기</h3>
              
              <div className="flex items-center mb-3">
                <div 
                  className="w-12 h-12 rounded-full mr-3 flex items-center justify-center"
                  style={{ backgroundColor: planetData.color }}
                >
                  {planetData.type === 'private' && <Lock className="h-6 w-6" />}
                  {planetData.type === 'public' && <Globe className="h-6 w-6" />}
                  {planetData.type === 'timeLimited' && <Clock className="h-6 w-6" />}
                </div>
                <div>
                  <h4 className="font-medium text-xl">{planetData.name}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-black/30">소행성 단계</Badge>
                    <Badge variant="outline" className="bg-black/30">
                      {planetData.type === 'private' && '비공개'}
                      {planetData.type === 'public' && '공개'}
                      {planetData.type === 'timeLimited' && '기간 제한'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-3">{planetData.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {planetData.topics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/10">
                    #{topic}
                  </Badge>
                ))}
              </div>
              
              {planetData.type === 'timeLimited' && planetData.expiryDate && (
                <p className="text-sm text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  종료일: {new Date(planetData.expiryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrevStep} className="bg-white/5">
              이전
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <Button onClick={handleNextStep} disabled={!isStepValid()} className="bg-blue-600 hover:bg-blue-700">
              다음 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-blue-600 hover:bg-blue-700">
              행성 생성하기 <CirclePlus className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanetCreationWizard;
