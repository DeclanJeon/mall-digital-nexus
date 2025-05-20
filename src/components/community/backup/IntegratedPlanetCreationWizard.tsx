// src/components/community/IntegratedPlanetCreationWizard.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Globe, Lock, Clock, Calendar, ArrowRight, CirclePlus, CircleCheck } from 'lucide-react';
import { PlanetCreationWizardProps, PlanetType } from './types'; // 수정된 타입 경로

const planetTemplates = [
  { name: '공개 커뮤니티', description: '누구나 참여할 수 있는 공개 커뮤니티', type: 'public' as PlanetType, color: '#3e9bff', icon: <Globe className="h-5 w-5" /> },
  { name: '비공개 커뮤니티', description: '초대 또는 승인을 통해서만 참여 가능한 비공개 커뮤니티', type: 'private' as PlanetType, color: '#4caf50', icon: <Lock className="h-5 w-5" /> },
  { name: '기간 제한 이벤트', description: '특정 기간 동안만 운영되는 이벤트 또는 프로젝트 커뮤니티', type: 'timeLimited' as PlanetType, color: '#e91e63', icon: <Clock className="h-5 w-5" /> }
];

const IntegratedPlanetCreationWizard: React.FC<PlanetCreationWizardProps> = ({ isOpen, onClose, onCreatePlanet }) => {
  const [step, setStep] = useState(1);
  const [planetWizardData, setPlanetWizardData] = useState({
    name: '', description: '', type: 'public' as PlanetType, topics: [] as string[],
    color: '#3e9bff', isPrivate: false, expiryDate: '', topicInput: '',
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
      size: 0.8 + Math.random() * 0.4, // 마법사에서는 사이즈를 직접 정하지 않음. 생성 시점에서 결정.
      lastActivity: new Date().toISOString(),
    });
    onCloseAndReset();
  };

  const onCloseAndReset = () => {
    onClose();
    setStep(1);
    setPlanetWizardData({
      name: '', description: '', type: 'public', topics: [], color: '#3e9bff',
      isPrivate: false, expiryDate: '', topicInput: '',
    });
  };

  const handleSelectTemplate = (template: typeof planetTemplates[number]) => {
    setPlanetWizardData(prevData => ({
      ...prevData, type: template.type, color: template.color,
      isPrivate: template.type === 'private'
    }));
  };

  const addTopic = () => {
    if (planetWizardData.topicInput.trim() && planetWizardData.topics.length < 5) {
      setPlanetWizardData(prev => ({ ...prev, topics: [...prev.topics, planetWizardData.topicInput.trim()], topicInput: '' }));
    }
  };

  const removeTopic = (index: number) => {
    setPlanetWizardData(prev => ({ ...prev, topics: prev.topics.filter((_, i) => i !== index) }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return planetWizardData.name.length >= 2 && (planetWizardData.type !== 'timeLimited' || planetWizardData.expiryDate !== '');
      case 2: return planetWizardData.description.length >= 10;
      case 3: return planetWizardData.topics.length > 0;
      default: return true;
    }
  };
  
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCloseAndReset(); }}>
      <DialogContent className="sm:max-w-[500px] bg-[#0c0c1d] border border-white/10 text-white">
        <DialogHeader><DialogTitle>새로운 행성 만들기 ({step}/4)</DialogTitle></DialogHeader>
        <div className="flex justify-between mb-6 pt-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex flex-col items-center w-1/4 ${s < step ? 'text-blue-400' : s === step ? 'text-white font-semibold' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${s < step ? 'bg-blue-600 border-blue-500' : s === step ? 'bg-blue-500 border-blue-400 animate-pulse' : 'bg-gray-700 border-gray-600'}`}>
                {s < step ? <CircleCheck className="h-5 w-5" /> : <span>{s}</span>}
              </div>
              <span className="text-xs mt-1.5 text-center">
                {s === 1 && '기본 정보'} {s === 2 && '세부 설명'} {s === 3 && '주제 설정'} {s === 4 && '최종 확인'}
              </span>
            </div>
          ))}
        </div>

        <div className="py-4 min-h-[280px]">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-1 block">행성 이름</Label>
                <Input id="name" placeholder="예: 개발자들의 안식처" value={planetWizardData.name} onChange={(e) => setPlanetWizardData({ ...planetWizardData, name: e.target.value })} className="bg-white/5 border-white/20 focus:border-blue-500" />
                {planetWizardData.name.length < 2 && <p className="text-xs text-red-400 mt-1">이름은 최소 2자 이상이어야 합니다.</p>}
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">행성 유형</Label>
                <div className="grid grid-cols-1 gap-3">
                  {planetTemplates.map((template) => (
                    <div key={template.type} onClick={() => handleSelectTemplate(template)} className={`p-3 rounded-md cursor-pointer border-2 transition-all ${planetWizardData.type === template.type ? 'bg-white/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-600'}`}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0" style={{ backgroundColor: template.color }}>{React.cloneElement(template.icon, {className: "h-5 w-5 text-white"}) }</div>
                        <div>
                          <h4 className="font-medium text-base">{template.name}</h4>
                          <p className="text-xs text-gray-400">{template.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {planetWizardData.type === 'timeLimited' && (
                <div className="animate-fade-in">
                  <Label htmlFor="expiryDate" className="text-sm font-medium mb-1 block">종료 날짜</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="expiryDate" type="date" value={planetWizardData.expiryDate} onChange={(e) => setPlanetWizardData({ ...planetWizardData, expiryDate: e.target.value })} className="pl-10 bg-white/5 border-white/20 focus:border-blue-500" min={getTodayDateString()} />
                  </div>
                  {planetWizardData.expiryDate === '' && <p className="text-xs text-red-400 mt-1">종료 날짜를 선택해주세요.</p>}
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label htmlFor="description" className="text-sm font-medium mb-1 block">행성 소개</Label>
                <Textarea id="description" placeholder="행성의 목적과 주요 활동을 설명해주세요. (최소 10자)" value={planetWizardData.description} onChange={(e) => setPlanetWizardData({ ...planetWizardData, description: e.target.value })} className="min-h-[120px] bg-white/5 border-white/20 focus:border-blue-500" maxLength={300} />
                <p className={`text-xs mt-1 ${planetWizardData.description.length < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                  {planetWizardData.description.length}/300 (최소 10자)
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">행성 대표 색상</Label>
                <div className="flex flex-wrap gap-3">
                  {['#3e9bff', '#10b981', '#e91e63', '#ff9800', '#9c27b0', '#607d8b', '#f44336', '#4caf50'].map((color) => (
                    <div key={color} onClick={() => setPlanetWizardData({ ...planetWizardData, color })} className={`w-9 h-9 rounded-full cursor-pointer transition-all transform hover:scale-110 ${planetWizardData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0c0c1d]' : ''}`} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label htmlFor="topicInput" className="text-sm font-medium mb-1 block">주제 태그 (최대 5개)</Label>
                <div className="flex gap-2">
                  <Input id="topicInput" placeholder="예: 코딩, 맛집탐방, 여행" value={planetWizardData.topicInput} onChange={(e) => setPlanetWizardData({ ...planetWizardData, topicInput: e.target.value })} className="flex-1 bg-white/5 border-white/20 focus:border-blue-500" onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); addTopic(); } }} />
                  <Button onClick={addTopic} disabled={!planetWizardData.topicInput.trim() || planetWizardData.topics.length >= 5} variant="outline" className="bg-white/10 hover:bg-white/20">추가</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
                  {planetWizardData.topics.map((topic, index) => (
                    <Badge key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30">
                      {topic}
                      <button onClick={() => removeTopic(index)} className="ml-2 text-blue-300/70 hover:text-white text-lg leading-none" aria-label={`${topic} 태그 삭제`}>×</button>
                    </Badge>
                  ))}
                </div>
                {planetWizardData.topics.length === 0 && <p className="text-xs text-yellow-400 mt-1">최소 하나 이상의 주제를 추가해주세요.</p>}
                {planetWizardData.topics.length >= 5 && <p className="text-xs text-gray-400 mt-1">태그는 최대 5개까지 추가할 수 있습니다.</p>}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-bold text-lg mb-3">행성 미리보기</h3>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full mr-4 flex items-center justify-center shrink-0" style={{ backgroundColor: planetWizardData.color }}>
                    {planetWizardData.type === 'private' && <Lock className="h-6 w-6 text-white" />}
                    {planetWizardData.type === 'public' && <Globe className="h-6 w-6 text-white" />}
                    {planetWizardData.type === 'timeLimited' && <Clock className="h-6 w-6 text-white" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-xl">{planetWizardData.name || "행성 이름"}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-black/30 border-white/20 text-xs">소행성 단계</Badge>
                      <Badge variant="outline" className="bg-black/30 border-white/20 text-xs">
                        {planetTemplates.find(t => t.type === planetWizardData.type)?.name || '유형'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3 min-h-[40px]">{planetWizardData.description || "행성 설명이 여기에 표시됩니다."}</p>
                {planetWizardData.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {planetWizardData.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="bg-white/10 text-gray-300">#{topic}</Badge>
                    ))}
                  </div>
                )}
                {planetWizardData.type === 'timeLimited' && planetWizardData.expiryDate && (
                  <p className="text-sm text-gray-400 flex items-center"><Calendar className="h-4 w-4 mr-1.5" />종료 예정: {new Date(planetWizardData.expiryDate).toLocaleDateString('ko-KR')}</p>
                )}
              </div>
              <p className="text-xs text-gray-400 text-center">모든 정보가 정확한지 확인 후 행성을 생성해주세요.</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between pt-2">
          {step > 1 ? <Button variant="outline" onClick={handlePrevStep} className="bg-white/10 hover:bg-white/20">이전</Button> : <div></div>}
          {step < 4 ?
            <Button onClick={handleNextStep} disabled={!isStepValid()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">다음 <ArrowRight className="ml-2 h-4 w-4" /></Button> :
            <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">행성 생성하기 <CirclePlus className="ml-2 h-4 w-4" /></Button>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntegratedPlanetCreationWizard;