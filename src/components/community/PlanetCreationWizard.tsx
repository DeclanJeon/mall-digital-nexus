import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlanetCreationWizardProps, PlanetType, PlanetWizardData } from './type';
import { 
  Globe, Lock, Clock, CircleCheck, CirclePlus, ArrowRight, Calendar 
} from 'lucide-react';





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

export const PlanetCreationWizard: React.FC<PlanetCreationWizardProps> = ({ 
  isOpen, 
  onClose, 
  onCreatePlanet 
}) => {
  const [step, setStep] = useState(1);
  const [planetWizardData, setPlanetWizardData] = useState<PlanetWizardData>({
    name: '', 
    description: '', 
    type: 'public', 
    topics: [], 
    color: '#3e9bff', 
    isPrivate: false, 
    expiryDate: '', 
    topicInput: ''
  });

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleFinish = () => {
    onCreatePlanet({
      name: planetWizardData.name,
      description: planetWizardData.description,
      type: planetWizardData.type,
      topics: planetWizardData.topics,
      color: planetWizardData.color,
      isPrivate: planetWizardData.isPrivate,
      expiryDate: planetWizardData.type === 'timeLimited' ? planetWizardData.expiryDate : undefined,
      size: 0.8 + Math.random() * 0.4,
      lastActivity: new Date().toISOString(),
    });
    onCloseAndReset();
  };

  const onCloseAndReset = () => {
    onClose();
    setStep(1);
    setPlanetWizardData({
      name: '', 
      description: '', 
      type: 'public', 
      topics: [], 
      color: '#3e9bff',
      isPrivate: false, 
      expiryDate: '', 
      topicInput: '',
    });
  };

  const handleSelectTemplate = (template: typeof planetTemplates[number]) => {
    setPlanetWizardData(prevData => ({
      ...prevData, 
      type: template.type, 
      color: template.color,
      isPrivate: template.type === 'private'
    }));
  };

  const addTopic = () => {
    if (planetWizardData.topicInput && planetWizardData.topics.length < 5) {
      setPlanetWizardData(prev => ({ 
        ...prev, 
        topics: [...prev.topics, prev.topicInput], 
        topicInput: '' 
      }));
    }
  };

  const removeTopic = (index: number) => {
    setPlanetWizardData(prev => ({ 
      ...prev, 
      topics: prev.topics.filter((_, i) => i !== index) 
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: 
        return planetWizardData.name.length >= 2 && 
              (planetWizardData.type !== 'timeLimited' || planetWizardData.expiryDate !== '');
      case 2: 
        return planetWizardData.description.length >= 10;
      case 3: 
        return planetWizardData.topics.length > 0;
      default: 
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAndReset}>
      <DialogContent className="sm:max-w-[500px] bg-[#0c0c1d] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>새로운 행성 만들기 ({step}/4)</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex flex-col items-center ${s < step ? 'text-blue-400' : s === step ? 'text-white' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s < step ? 'bg-blue-600' : s === step ? 'bg-blue-500' : 'bg-gray-700'}`}>
                {s < step ? <CircleCheck className="h-5 w-5" /> : <span>{s}</span>}
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

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">행성 이름</Label>
              <Input 
                id="name" 
                placeholder="행성 이름" 
                value={planetWizardData.name} 
                onChange={(e) => setPlanetWizardData({ ...planetWizardData, name: e.target.value })} 
                className="bg-white/5 border-white/20"
              />
            </div>
            
            <div>
              <Label>행성 유형</Label>
              <div className="grid grid-cols-1 gap-3">
                {planetTemplates.map((template, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleSelectTemplate(template)}
                    className={`p-4 rounded-md cursor-pointer border transition-all ${
                      planetWizardData.type === template.type 
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
            
            {planetWizardData.type === 'timeLimited' && (
              <div>
                <Label htmlFor="expiryDate">종료 날짜</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="expiryDate" 
                    type="date" 
                    value={planetWizardData.expiryDate} 
                    onChange={(e) => setPlanetWizardData({ ...planetWizardData, expiryDate: e.target.value })} 
                    className="pl-10 bg-white/5 border-white/20" 
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">행성 소개</Label>
              <Textarea 
                id="description" 
                placeholder="행성의 목적과 활동을 설명해주세요" 
                value={planetWizardData.description} 
                onChange={(e) => setPlanetWizardData({ ...planetWizardData, description: e.target.value })} 
                className="min-h-[150px] bg-white/5 border-white/20"
              />
              <p className="text-xs text-gray-400">
                최소 10자 이상. ({planetWizardData.description.length}/300)
              </p>
            </div>
            
            <div>
              <Label>행성 색상</Label>
              <div className="flex flex-wrap gap-3">
                {['#3e9bff', '#4caf50', '#e91e63', '#ff9800', '#9c27b0', '#607d8b'].map((color) => (
                  <div 
                    key={color} 
                    onClick={() => setPlanetWizardData({ ...planetWizardData, color })}
                    className={`w-8 h-8 rounded-full cursor-pointer ${
                      planetWizardData.color === color 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0c0c1d]' 
                        : ''
                    }`} 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>주제 태그 (최대 5개)</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="주제 또는 태그 입력" 
                  value={planetWizardData.topicInput} 
                  onChange={(e) => setPlanetWizardData({ ...planetWizardData, topicInput: e.target.value })} 
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
                  disabled={!planetWizardData.topicInput || planetWizardData.topics.length >= 5} 
                  variant="outline"
                >
                  추가
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {planetWizardData.topics.map((topic, index) => (
                  <Badge 
                    key={index} 
                    className="px-3 py-1 bg-white/10 hover:bg-white/20"
                  >
                    {topic}
                    <button 
                      onClick={() => removeTopic(index)} 
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {planetWizardData.topics.length === 0 && (
                  <p className="text-sm text-gray-400">최소 하나 이상의 주제를 추가해주세요.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="font-bold text-lg mb-2">행성 미리보기</h3>
              
              <div className="flex items-center mb-3">
                <div 
                  className="w-12 h-12 rounded-full mr-3 flex items-center justify-center" 
                  style={{ backgroundColor: planetWizardData.color }}
                >
                  {planetWizardData.type === 'private' && <Lock className="h-6 w-6" />}
                  {planetWizardData.type === 'public' && <Globe className="h-6 w-6" />}
                  {planetWizardData.type === 'timeLimited' && <Clock className="h-6 w-6" />}
                </div>
                
                <div>
                  <h4 className="font-medium text-xl">{planetWizardData.name}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-black/30">소행성 단계</Badge>
                    <Badge variant="outline" className="bg-black/30">
                      {planetWizardData.type === 'private' ? '비공개' : 
                       planetWizardData.type === 'public' ? '공개' : '기간 제한'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-3">{planetWizardData.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {planetWizardData.topics.map((topic, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-white/10"
                  >
                    #{topic}
                  </Badge>
                ))}
              </div>
              
              {planetWizardData.type === 'timeLimited' && planetWizardData.expiryDate && (
                <p className="text-sm text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  종료일: {new Date(planetWizardData.expiryDate).toLocaleDateString()}
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
          ) : <div />}
          
          {step < 4 ? (
            <Button 
              onClick={handleNextStep} 
              disabled={!isStepValid()} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              다음 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleFinish} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              행성 생성하기 <CirclePlus className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};