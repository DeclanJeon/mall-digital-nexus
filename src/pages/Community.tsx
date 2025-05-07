import React, { useState, useEffect, useCallback, useRef /* Added useRef */ } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Search, MessageSquare, Users, Send, Globe, Circle, Star, Bell, Plus, Edit, Trash2, ZoomIn, ZoomOut,
  ArrowRight, Calendar, Lock, Clock, MapPin, // Added icons for wizard
  CirclePlus, CircleCheck // Added icons for wizard
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Still used for post form
import { useForm } from 'react-hook-form'; // Still used for post form
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // For Wizard
import { Label } from '@/components/ui/label'; // For Wizard

// Define PlanetType for the wizard and Planet interface
type PlanetType = 'public' | 'private' | 'timeLimited';

// Updated Planet interface
interface Planet {
  id: string;
  name: string;
  description: string;
  color: string;
  position: [number, number, number]; // [x, y, z] for map positioning
  size: number;
  activeUsers: number;
  recentPosts: number;
  texture?: string;

  // Fields from/for PlanetCreationWizard
  type: PlanetType;
  topics: string[];
  isPrivate: boolean;
  expiryDate?: string;
  stage: 'asteroid' | 'planet' | 'gasGiant' | 'star'; // Stage of development
  owner: string; // Username of the creator
  membersCount: number;
  lastActivity: string; // ISO date string
}

// Post, ChatMessage, ForumPostFormData interfaces remain the same
interface Post { id: string; title: string; content: string; author: string; authorAvatar: string; date: string; likes: number; comments: number; tags: string[]; country: string; htmlContent?: string; }
interface ChatMessage { id: string; author: string; authorAvatar: string; content: string; timestamp: string; country: string; }
interface ForumPostFormData { title: string; content: string; tags: string; }

// Initial Planet Data (updated with new fields)
const initialPlanetsData: Planet[] = [
  {
    id: 'earth', name: '지구', description: '글로벌 커뮤니티 허브, 지역별 게시판 이용 가능', color: '#1E88E5',
    position: [0, 0, 0], size: 2, activeUsers: 2453, recentPosts: 178, type: 'public', topics: ['global', 'community'],
    isPrivate: false, stage: 'planet', owner: 'System', membersCount: 2453, lastActivity: new Date().toISOString(),
  },
  {
    id: 'techverse', name: '테크버스', description: '기술 토론, 코딩 도움, 가젯 리뷰', color: '#E53935',
    position: [6, 1, -3], size: 1.3, activeUsers: 982, recentPosts: 76, type: 'public', topics: ['tech', 'code', 'gadgets'],
    isPrivate: false, stage: 'planet', owner: 'System', membersCount: 982, lastActivity: new Date().toISOString(),
  },
  {
    id: 'artsphere', name: '아트스피어', description: '디지털 및 전통 아티스트를 위한 창조적 예술 커뮤니티', color: '#43A047',
    position: [-5, -1, -4], size: 1.5, activeUsers: 754, recentPosts: 92, type: 'public', topics: ['art', 'design'],
    isPrivate: false, stage: 'planet', owner: 'System', membersCount: 754, lastActivity: new Date().toISOString(),
  },
  {
    id: 'marketjupiter', name: '마켓주피터', description: '이커머스 논의, 판매 팁, 시장 트렌드', color: '#FB8C00',
    position: [8, -2, 1], size: 1.8, activeUsers: 534, recentPosts: 43, type: 'public', topics: ['ecommerce', 'business'],
    isPrivate: false, stage: 'planet', owner: 'System', membersCount: 534, lastActivity: new Date().toISOString(),
  }
];

// --- PlanetCreationWizard Component (Integrated and adapted) ---
interface PlanetCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  // This callback now provides data specific to wizard inputs
  onCreatePlanet: (wizardData: {
    name: string;
    description: string;
    type: PlanetType;
    topics: string[];
    color: string;
    isPrivate: boolean;
    expiryDate?: string;
    size: number; // Wizard determines initial size
    lastActivity: string;
  }) => void;
}

const planetTemplates = [
  { name: '공개 커뮤니티', description: '누구나 참여할 수 있는 공개 커뮤니티', type: 'public' as PlanetType, color: '#3e9bff', icon: <Globe className="h-5 w-5" /> },
  { name: '비공개 커뮤니티', description: '초대 또는 승인을 통해서만 참여 가능한 비공개 커뮤니티', type: 'private' as PlanetType, color: '#4caf50', icon: <Lock className="h-5 w-5" /> },
  { name: '기간 제한 이벤트', description: '특정 기간 동안만 운영되는 이벤트 또는 프로젝트 커뮤니티', type: 'timeLimited' as PlanetType, color: '#e91e63', icon: <Clock className="h-5 w-5" /> }
];

const IntegratedPlanetCreationWizard: React.FC<PlanetCreationWizardProps> = ({ isOpen, onClose, onCreatePlanet }) => {
  const [step, setStep] = useState(1);
  const [planetWizardData, setPlanetWizardData] = useState({
    name: '', description: '', type: 'public' as PlanetType, topics: [] as string[],
    color: '#3e9bff', isPrivate: false, expiryDate: '', topicInput: '', // Renamed 'topic' to 'topicInput'
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
      size: 0.8 + Math.random() * 0.4, // Random initial size
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
    if (planetWizardData.topicInput && planetWizardData.topics.length < 5) {
      setPlanetWizardData(prev => ({ ...prev, topics: [...prev.topics, prev.topicInput], topicInput: '' }));
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

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAndReset}> {/* Use onCloseAndReset here */}
      <DialogContent className="sm:max-w-[500px] bg-[#0c0c1d] border border-white/10 text-white">
        <DialogHeader><DialogTitle>새로운 행성 만들기 ({step}/4)</DialogTitle></DialogHeader>
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex flex-col items-center ${s < step ? 'text-blue-400' : s === step ? 'text-white' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s < step ? 'bg-blue-600' : s === step ? 'bg-blue-500' : 'bg-gray-700'}`}>
                {s < step ? <CircleCheck className="h-5 w-5" /> : <span>{s}</span>}
              </div>
              <span className="text-xs mt-1">
                {s === 1 && '기본 정보'} {s === 2 && '설명'} {s === 3 && '주제 설정'} {s === 4 && '확인'}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (<div className="space-y-4"> {/* Basic Info Fields */}
            <div><Label htmlFor="name">행성 이름</Label><Input id="name" placeholder="행성 이름" value={planetWizardData.name} onChange={(e) => setPlanetWizardData({ ...planetWizardData, name: e.target.value })} className="bg-white/5 border-white/20"/></div>
            <div><Label>행성 유형</Label><div className="grid grid-cols-1 gap-3">
                {planetTemplates.map((template, index) => (
                  <div key={index} onClick={() => handleSelectTemplate(template)} className={`p-4 rounded-md cursor-pointer border transition-all ${planetWizardData.type === template.type ? 'bg-white/10 border-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="flex items-center"><div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: template.color }}>{template.icon}</div>
                      <div><h4 className="font-medium">{template.name}</h4><p className="text-sm text-gray-400">{template.description}</p></div>
                    </div></div>))}</div></div>
            {planetWizardData.type === 'timeLimited' && (<div><Label htmlFor="expiryDate">종료 날짜</Label><div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input id="expiryDate" type="date" value={planetWizardData.expiryDate} onChange={(e) => setPlanetWizardData({ ...planetWizardData, expiryDate: e.target.value })} className="pl-10 bg-white/5 border-white/20" min={new Date().toISOString().split('T')[0]}/>
            </div></div>)}</div>)}
        {step === 2 && (<div className="space-y-4"> {/* Description Fields */}
            <div><Label htmlFor="description">행성 소개</Label><Textarea id="description" placeholder="행성의 목적과 활동을 설명해주세요" value={planetWizardData.description} onChange={(e) => setPlanetWizardData({ ...planetWizardData, description: e.target.value })} className="min-h-[150px] bg-white/5 border-white/20"/><p className="text-xs text-gray-400">최소 10자 이상. ({planetWizardData.description.length}/300)</p></div>
            <div><Label>행성 색상</Label><div className="flex flex-wrap gap-3">
                {['#3e9bff', '#4caf50', '#e91e63', '#ff9800', '#9c27b0', '#607d8b'].map((color) => (<div key={color} onClick={() => setPlanetWizardData({ ...planetWizardData, color })} className={`w-8 h-8 rounded-full cursor-pointer ${planetWizardData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0c0c1d]' : ''}`} style={{ backgroundColor: color }}/>))}
            </div></div></div>)}
        {step === 3 && (<div className="space-y-4"> {/* Topics Fields */}
            <div><Label>주제 태그 (최대 5개)</Label><div className="flex gap-2">
                <Input placeholder="주제 또는 태그 입력" value={planetWizardData.topicInput} onChange={(e) => setPlanetWizardData({ ...planetWizardData, topicInput: e.target.value })} className="flex-1 bg-white/5 border-white/20" onKeyDown={(e) => {if (e.key === 'Enter') { e.preventDefault(); addTopic();}}}/>
                <Button onClick={addTopic} disabled={!planetWizardData.topicInput || planetWizardData.topics.length >= 5} variant="outline">추가</Button></div>
            <div className="flex flex-wrap gap-2 mt-3">{planetWizardData.topics.map((topic, index) => (<Badge key={index} className="px-3 py-1 bg-white/10 hover:bg-white/20">{topic}<button onClick={() => removeTopic(index)} className="ml-2 text-gray-400 hover:text-white">×</button></Badge>))}
                {planetWizardData.topics.length === 0 && (<p className="text-sm text-gray-400">최소 하나 이상의 주제를 추가해주세요.</p>)}</div></div></div>)}
        {step === 4 && (<div className="space-y-4"> {/* Review Fields */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10"><h3 className="font-bold text-lg mb-2">행성 미리보기</h3>
            <div className="flex items-center mb-3"><div className="w-12 h-12 rounded-full mr-3 flex items-center justify-center" style={{ backgroundColor: planetWizardData.color }}>
                {planetWizardData.type === 'private' && <Lock className="h-6 w-6" />}{planetWizardData.type === 'public' && <Globe className="h-6 w-6" />}{planetWizardData.type === 'timeLimited' && <Clock className="h-6 w-6" />}</div>
                <div><h4 className="font-medium text-xl">{planetWizardData.name}</h4><div className="flex gap-2"><Badge variant="outline" className="bg-black/30">소행성 단계</Badge><Badge variant="outline" className="bg-black/30">{planetWizardData.type === 'private'?'비공개':planetWizardData.type==='public'?'공개':'기간 제한'}</Badge></div></div></div>
            <p className="text-gray-300 mb-3">{planetWizardData.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">{planetWizardData.topics.map((topic, index) => (<Badge key={index} variant="secondary" className="bg-white/10">#{topic}</Badge>))}</div>
            {planetWizardData.type === 'timeLimited' && planetWizardData.expiryDate && (<p className="text-sm text-gray-400 flex items-center"><Calendar className="h-4 w-4 mr-1" />종료일: {new Date(planetWizardData.expiryDate).toLocaleDateString()}</p>)}
        </div></div>)}

        <DialogFooter className="flex justify-between">
          {step > 1 ? <Button variant="outline" onClick={handlePrevStep} className="bg-white/5">이전</Button> : <div></div>}
          {step < 4 ? <Button onClick={handleNextStep} disabled={!isStepValid()} className="bg-blue-600 hover:bg-blue-700">다음 <ArrowRight className="ml-2 h-4 w-4" /></Button>
                     : <Button onClick={handleFinish} className="bg-blue-600 hover:bg-blue-700">행성 생성하기 <CirclePlus className="ml-2 h-4 w-4" /></Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
// --- End PlanetCreationWizard Component ---


const Community = () => {
  const [planets, setPlanets] = useState<Planet[]>(initialPlanetsData);
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);
  const [showBoardView, setShowBoardView] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('서울, 대한민국');
  const [activeTab, setActiveTab] = useState('posts');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState<string>("");
  const [darkMode, setDarkMode] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast, dismiss } = useToast();

  const [zoomLevel, setZoomLevel] = useState(1);
  const universeMapRef = useRef<HTMLDivElement>(null); // Ref for the map container

  // States for new planet creation flow
  const [isSelectingPlanetPosition, setIsSelectingPlanetPosition] = useState(false);
  const [newPlanetPositionForWizard, setNewPlanetPositionForWizard] = useState<[number, number, number] | null>(null);
  const [isPlanetWizardOpen, setIsPlanetWizardOpen] = useState(false);
  const [cursorPositionHint, setCursorPositionHint] = useState<{x: number, y: number} | null>(null);


  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));

  // Forum form (for posts, not planets)
  const forumForm = useForm<ForumPostFormData>({
    defaultValues: { title: '', content: '', tags: '' }
  });
  
  const filteredPlanets = planets.filter(planet =>
    planet.name.toLowerCase().includes(filter.toLowerCase()) ||
    planet.description.toLowerCase().includes(filter.toLowerCase())
  );

  // IndexedDB functions (initDB, loadPosts, etc.) remain largely unchanged
  // ... (Assume these are correctly defined as in your original code)
    const initDB = () => { /* ... */ }; const loadPosts = () => { /* ... */ }; const saveInitialPostsToDB = (initialPosts: Post[]) => { /* ... */ }; const savePostToDB = (post: Post) => { /* ... */ }; const updatePostInDB = (post: Post) => { /* ... */ }; const deletePostFromDB = (postId: string) => { /* ... */ };


  useEffect(() => {
    const storedUsername = localStorage.getItem('peerspace_username');
    const generatedUsername = storedUsername || getRandomAnimalName();
    if (!storedUsername) localStorage.setItem('peerspace_username', generatedUsername);
    setUsername(generatedUsername);
    // setMessages(initialMessages); // Assuming messages are loaded or handled elsewhere
    initDB();
  }, []);
  
  const onForumSubmit = useCallback((data: ForumPostFormData) => { /* ... (unchanged) ... */ }, [username, editingPost, forumForm]);
  const handleEditPost = useCallback((post: Post) => { /* ... (unchanged) ... */ }, [forumForm]);
  function getRandomAnimalName(): string { /* ... (unchanged) ... */ return `익명_${Math.random().toString(36).substring(7)}`; }

  const handleRegularPlanetClick = (planet: Planet) => { // Renamed to avoid conflict
    setActivePlanet(planet);
    setSelectedLocation(`${planet.name} 행성`);
    setShowBoardView(true);
  };

  // Handler for map click during position selection
  const handleMapClickForPosition = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectingPlanetPosition || !universeMapRef.current) return;

    const rect = universeMapRef.current.getBoundingClientRect();
    // Calculate click relative to the non-scaled container, then adjust for zoom
    // This assumes the click is on the direct child that is scaled.
    // Or, more simply, get coordinates relative to the scaled visual map.
    // The planets are positioned based on percentages, so a click on the container
    // needs to be translated to that percentage space.
    
    // Calculate click position relative to the viewport of the scaled map container
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Normalize to 0-1 range based on the visible (potentially zoomed) map dimensions
    // This mapping is for the visual representation of the [-10, 10] data range
    const mapPercentX = clickX / rect.width;
    const mapPercentY = clickY / rect.height;

    // Convert percentage to data range [-10, 10]
    // If position [0] = -10 -> left = 0%. If position [0] = 0 -> left = 50%. If position [0] = 10 -> left = 100%.
    // So, position_x = (mapPercentX * 20) - 10
    const posX = (mapPercentX * 20) - 10;
    const posY = (mapPercentY * 20) - 10;
    const posZ = 0; // For 2D map, Z can be 0 or a small random value

    setNewPlanetPositionForWizard([posX, posY, posZ]);
    setIsSelectingPlanetPosition(false);
    setCursorPositionHint(null);
    setIsPlanetWizardOpen(true);
  };

  const handleMouseMoveOnMap = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectingPlanetPosition || !universeMapRef.current) {
      setCursorPositionHint(null);
      return;
    }
    const rect = universeMapRef.current.getBoundingClientRect();
    setCursorPositionHint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };


  // Called when "Create Planet" (+) button is clicked
  const startPlanetCreationProcess = () => {
    setActivePlanet(null); // Deselect any active planet
    setIsSelectingPlanetPosition(true);
    // Toast/message to instruct user can be added here
    toast({ title: "행성 위치 선택", description: "지도에서 새 행성의 위치를 클릭하세요." });
  };

    const handleDismissToast = () => {
    if (dismiss) {
      dismiss();
    }
  };

  // Called by the IntegratedPlanetCreationWizard
  const handleWizardCreatePlanet = (wizardData: {
    name: string; description: string; type: PlanetType; topics: string[];
    color: string; isPrivate: boolean; expiryDate?: string; size: number; lastActivity: string;
  }) => {
    if (!newPlanetPositionForWizard) {
      toast({ title: "오류", description: "행성 위치가 선택되지 않았습니다. 다시 시도해주세요.", variant: "destructive" });
      handleDismissToast();
      setIsPlanetWizardOpen(false); // Close wizard if position somehow got lost
      return;
    }

    const newPlanet: Planet = {
      id: `planet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: wizardData.name,
      description: wizardData.description,
      type: wizardData.type,
      topics: wizardData.topics,
      color: wizardData.color,
      isPrivate: wizardData.isPrivate,
      expiryDate: wizardData.expiryDate,
      lastActivity: wizardData.lastActivity,
      size: wizardData.size,
      position: newPlanetPositionForWizard, // Use map-selected position
      activeUsers: 1,
      recentPosts: 0,
      stage: 'asteroid', // New planets start as asteroids
      owner: username,
      membersCount: 1,
    };

    setPlanets(prev => [...prev, newPlanet]);
    setNewPlanetPositionForWizard(null);
    // Wizard calls its own onClose, so no need to setIsPlanetWizardOpen(false) here
    toast({ title: "행성 생성 완료!", description: `${newPlanet.name} 행성이 우주에 추가되었습니다.` });
  };

  const handleSendMessage = () => { /* ... (unchanged) ... */ };
  const handleReturnToUniverse = () => { setShowBoardView(false); setActivePlanet(null); setIsSelectingPlanetPosition(false); };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]' : 'bg-gray-50'} text-white transition-colors duration-300`}>
      <IntegratedPlanetCreationWizard
        isOpen={isPlanetWizardOpen}
        onClose={() => setIsPlanetWizardOpen(false)}
        onCreatePlanet={handleWizardCreatePlanet}
      />
      {/* Header (mostly unchanged) */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-30"> {/* z-index lower than wizard */}
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4"> <Globe className="h-6 w-6 text-blue-400" /> <h1 className="text-xl font-bold">피어스페이스 Universe</h1> </div>
          <div className="flex items-center space-x-4">
            {!showBoardView && (<div className="relative w-64"> <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> <Input placeholder="행성 검색..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9 bg-white/10 border-white/20 text-white"/> </div>)}
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-white/5 hover:bg-white/10"> {darkMode ? <Circle className="h-5 w-5 text-yellow-300" /> : <Star className="h-5 w-5 text-blue-300" />} </button>
            <div className="relative"> <Bell className="h-5 w-5 text-blue-300" /> <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">3</span> </div>
            <Avatar className="h-8 w-8"> <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${username}`} alt={username} /> <AvatarFallback>{username.substring(0, 2)}</AvatarFallback> </Avatar>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {!showBoardView ? (
          <div className="relative">
            {/* Planet Info Panel (only if not selecting position) */}
            {activePlanet && !isSelectingPlanetPosition && (
              <div className="absolute top-4 left-4 z-10 p-4 rounded-lg bg-black/60 backdrop-blur-md max-w-md animate-fade-in">
                <h2 className="text-xl font-bold mb-2">{activePlanet.name}</h2>
                <p className="text-blue-300 mb-3">{activePlanet.description}</p>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1"><Users className="h-4 w-4 text-green-400" /><span>{activePlanet.activeUsers.toLocaleString()} 활동 사용자</span></div>
                  <div className="flex items-center space-x-1"><MessageSquare className="h-4 w-4 text-yellow-400" /><span>{activePlanet.recentPosts.toLocaleString()} 최근 게시물</span></div>
                </div>
              </div>
            )}
            
            {/* Universe Viewport */}
            <div 
              ref={universeMapRef}
              className={`w-full h-[calc(80vh-40px)] rounded-2xl overflow-hidden bg-transparent relative ${isSelectingPlanetPosition ? 'cursor-crosshair' : ''}`}
              onClick={isSelectingPlanetPosition ? handleMapClickForPosition : undefined} // Click handler for position selection
              onMouseMove={isSelectingPlanetPosition ? handleMouseMoveOnMap : undefined}
              onMouseLeave={() => isSelectingPlanetPosition && setCursorPositionHint(null) }
            >
              {/* Visual hint for position selection */}
              {isSelectingPlanetPosition && cursorPositionHint && (
                  <div 
                    className="absolute w-8 h-8 rounded-full bg-blue-500/50 border-2 border-blue-300 pointer-events-none"
                    style={{ 
                        left: `${cursorPositionHint.x - 16}px`, // Center the hint on cursor
                        top: `${cursorPositionHint.y - 16}px`,
                        transform: `scale(${zoomLevel})` // Adjust hint size with zoom
                    }}
                  />
              )}
              <div 
                className="w-full h-full bg-[#0a0a1a] relative transition-transform duration-300 ease-in-out"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                {/* Star backgrounds and planets (rendering logic mostly unchanged) */}
                <div className="absolute inset-0 stars-small"></div> <div className="absolute inset-0 stars-medium"></div> <div className="absolute inset-0 stars-large"></div>
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(76, 0, 255, 0.3), rgba(125, 0, 125, 0.2) 40%, transparent 70%)' }}></div>
                
                {filteredPlanets.map((planet) => {
                  const left = 50 + (planet.position[0] * 5); // position[0] is X in [-10, 10] range
                  const top = 50 + (planet.position[1] * 5);  // position[1] is Y in [-10, 10] range
                  const size = planet.size * 40;
                  
                  return (
                    <div
                      key={planet.id}
                      className="absolute rounded-full cursor-pointer transition-transform hover:scale-110 planet-pulse"
                      style={{ left: `${left}%`, top: `${top}%`, width: `${size}px`, height: `${size}px`, backgroundColor: planet.color, transform: 'translate(-50%, -50%)', boxShadow: `0 0 ${size/2}px ${size/8}px ${planet.color}40` }}
                      onClick={(e) => {
                        if (isSelectingPlanetPosition) {
                            e.stopPropagation(); // Prevent map click if planet is clicked during selection mode
                            handleMapClickForPosition(e);
                        } else {
                            handleRegularPlanetClick(planet);
                        }
                      }}
                      onMouseEnter={() => !isSelectingPlanetPosition && setActivePlanet(planet)}
                      onMouseLeave={() => !isSelectingPlanetPosition && setActivePlanet(null)}
                    >
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap p-1 bg-black/30 rounded">{planet.name}</div>
                    </div>);
                })}
                <div className="shooting-star" style={{ left: '10%', top: '20%', animationDelay: '0s' }}></div> <div className="shooting-star" style={{ left: '60%', top: '50%', animationDelay: '3s' }}></div> <div className="shooting-star" style={{ left: '30%', top: '70%', animationDelay: '6s' }}></div>
                <div className="particles"></div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center bg-black/60 backdrop-blur-md p-3 rounded-full z-10">
              <p className="text-sm">
                {isSelectingPlanetPosition 
                  ? "새 행성을 배치할 위치를 클릭하세요." 
                  : "행성을 클릭하여 커뮤니티를 탐색하거나, 새 행성을 창조하세요!"}
              </p>
            </div>

            {/* Controls (Zoom and Create Planet) */}
            <div className="absolute bottom-8 right-8 flex flex-col space-y-2 z-20">
              <Button onClick={handleZoomIn} size="icon" variant="outline" className="bg-black/50 border-white/20 hover:bg-black/70"><ZoomIn className="h-5 w-5" /></Button>
              <Button onClick={handleZoomOut} size="icon" variant="outline" className="bg-black/50 border-white/20 hover:bg-black/70"><ZoomOut className="h-5 w-5" /></Button>
              <Button
                onClick={isSelectingPlanetPosition ? () => {setIsSelectingPlanetPosition(false); setCursorPositionHint(null); handleDismissToast()} : startPlanetCreationProcess}
                size="icon"
                variant="outline"
                className={`bg-black/50 border-white/20 hover:bg-black/70 ${isSelectingPlanetPosition ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}
              >
                {isSelectingPlanetPosition ? <Circle className="h-5 w-5 text-blue-400 animate-pulse" /> : <Plus className="h-5 w-5" />}
              </Button>
              {isSelectingPlanetPosition && (
                <Button onClick={() => {setIsSelectingPlanetPosition(false); setCursorPositionHint(null); handleDismissToast()}} size="sm" variant="destructive" className="text-xs">취소</Button>
              )}
            </div>
          </div>
        ) : (
          /* Board View (mostly unchanged) */
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 animate-fade-in">
             {/* ... (Board View JSX - same as your previous working version) ... */}
             <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <button onClick={handleReturnToUniverse} className="text-blue-400 hover:text-blue-300 flex items-center space-x-1">
                    <Globe className="h-5 w-5" /><span>우주로 돌아가기</span>
                  </button>
                </div>
                <h1 className="text-2xl font-bold">{selectedLocation} 커뮤니티</h1>
              </div>
              <div className="flex space-x-4">
                <div className="relative w-64"> <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> <Input placeholder="게시글 검색..." className="pl-9 bg-white/10 border-white/20 text-white"/> </div>
                <Button onClick={() => { setEditingPost(null); setShowNewPostForm(true); forumForm.reset(); }}>새 글쓰기</Button>
              </div>
            </div>
            {showNewPostForm && ( <Card className="bg-white/5 border-white/10 mb-6 overflow-hidden"> <CardHeader><CardTitle>{editingPost ? '게시글 수정' : '새 게시글 작성'}</CardTitle></CardHeader> <CardContent> <Form {...forumForm}> <form onSubmit={forumForm.handleSubmit(onForumSubmit)} className="space-y-4"> <FormField control={forumForm.control} name="title" render={({ field }) => ( <FormItem><FormLabel>제목</FormLabel><FormControl><Input placeholder="제목 입력" className="bg-white/10 border-white/20 text-white" {...field} /></FormControl><FormMessage /></FormItem> )}/> <FormField control={forumForm.control} name="tags" render={({ field }) => ( <FormItem><FormLabel>태그</FormLabel><FormControl><Input placeholder="쉼표로 구분" className="bg-white/10 border-white/20 text-white" {...field} /></FormControl><FormMessage /></FormItem> )}/> <FormField control={forumForm.control} name="content" render={({ field }) => ( <FormItem><FormLabel>내용</FormLabel><FormControl><Textarea placeholder="내용 입력..." className="min-h-[300px] bg-white/10 border-white/20 text-white resize-none" {...field} /></FormControl><FormMessage /></FormItem> )}/> <div className="flex justify-end space-x-2"> <Button type="button" variant="outline" onClick={() => { setShowNewPostForm(false); setEditingPost(null); }}>취소</Button> <Button type="submit">{editingPost ? '수정하기' : '게시하기'}</Button> </div> </form> </Form> </CardContent> </Card> )}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3"> <Tabs value={activeTab} onValueChange={setActiveTab}> <TabsList className="mb-4 bg-white/5"><TabsTrigger value="posts">게시글</TabsTrigger><TabsTrigger value="trending">인기글</TabsTrigger><TabsTrigger value="following">팔로우</TabsTrigger></TabsList> <TabsContent value="posts" className="space-y-4"> {posts.length > 0 ? posts.map(post => ( <Card key={post.id} className="bg-white/5 border-white/10 animate-fade-in"> <CardContent className="p-4"> <div className="flex items-start justify-between"> <div className="flex items-center space-x-3 mb-3"> <Avatar><AvatarImage src={post.authorAvatar} alt={post.author} /><AvatarFallback>{post.author[0]}</AvatarFallback></Avatar> <div><p className="font-medium">{post.author}</p><p className="text-xs text-gray-400">{post.date}</p></div> </div> {post.author === username && ( <div className="flex space-x-2"> <button onClick={() => handleEditPost(post)} className="text-gray-400 hover:text-gray-200 transition-colors"><Edit className="h-4 w-4" /></button> <button onClick={() => deletePostFromDB(post.id)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button> </div> )} </div> <h3 className="text-lg font-bold mb-2">{post.title}</h3> {post.htmlContent ? (<div className="text-gray-300 mb-4 prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.htmlContent }}/>) : (<p className="text-gray-300 mb-4">{post.content}</p>)} <div className="flex flex-wrap gap-2 mb-4">{post.tags.map(tag => (<Badge key={tag} variant="outline" className="text-blue-300 border-blue-300/30">#{tag}</Badge>))}</div> <div className="flex justify-between text-sm text-gray-400"> <div className="flex items-center space-x-4"> <button className="flex items-center space-x-1 hover:text-blue-300 transition-colors"><Star className="h-4 w-4" /><span>{post.likes}</span></button> <div className="flex items-center space-x-1"><MessageSquare className="h-4 w-4" /><span>{post.comments}</span></div> </div> <Button variant="ghost" size="sm" className="text-blue-400">자세히 보기</Button> </div> </CardContent> </Card> )) : ( <div className="p-8 text-center text-gray-400">게시글이 없습니다.</div> )} </TabsContent> <TabsContent value="trending"><div className="p-8 text-center">인기글이 표시됩니다.</div></TabsContent> <TabsContent value="following"><div className="p-8 text-center">팔로우 콘텐츠가 표시됩니다.</div></TabsContent> </Tabs> </div>
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col h-[700px]"> <div className="p-4 border-b border-white/10 flex justify-between items-center"> <h3 className="font-bold">글로벌 채팅</h3> <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30"><Circle className="h-2 w-2 mr-1 fill-green-500" /><span>{Math.floor(Math.random()*50)+20}명 온라인</span></Badge> </div> <div className="flex-grow overflow-y-auto p-4 space-y-4"> {messages.map((message) => ( <div key={message.id} className={`flex ${message.author === username ? 'justify-end' : 'justify-start'}`}> <div className={`flex ${message.author === username ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[90%] space-x-2 space-x-reverse`}> <Avatar className="h-8 w-8 flex-shrink-0"><AvatarImage src={message.authorAvatar} alt={message.author} /><AvatarFallback>{message.author[0]}</AvatarFallback></Avatar> <div className={`px-4 py-2 rounded-2xl ${message.author === username ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}> <div className="flex justify-between items-center mb-1"><span className="text-xs font-medium">{message.author}</span><span className="text-xs opacity-70 ml-2">{message.timestamp}</span></div> <p className="break-words">{message.content}</p> </div> </div> </div> ))} </div> <div className="p-3 border-t border-white/10 bg-black/20"> <div className="flex space-x-2"> <Input placeholder="메시지 입력..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSendMessage();}} className="bg-white/5 border-white/20"/> <Button size="icon" onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700"><Send className="h-4 w-4" /></Button> </div> </div> </div>
            </div>
          </div>
        )}
      </div>
      
      <style>
        {`
        /* Star backgrounds, shooting stars, planet pulse, particles, fade-in (as before) */
        .stars-small { background-image: radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent), radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent), radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent), radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent), radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent), radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent); background-size: 200px 200px; animation: twinkle 7s ease-in-out infinite alternate; }
        .stars-medium { background-image: radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent), radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent), radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent); background-size: 300px 300px; animation: twinkle 15s ease-in-out infinite alternate; }
        .stars-large { background-image: radial-gradient(2px 2px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent), radial-gradient(2px 2px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent); background-size: 400px 400px; animation: twinkle 20s ease-in-out infinite alternate; }
        @keyframes twinkle { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
        .shooting-star { position: absolute; width: 2px; height: 2px; background-color: white; border-radius: 50%; opacity: 0; animation: shoot 10s linear infinite; }
        @keyframes shoot { 0% { transform: translate(0,0) rotate(-45deg) scale(1); opacity:0; } 5% { opacity:1; transform:translate(20px,20px) rotate(-45deg) scale(1); } 10% { transform:translate(400px,400px) rotate(-45deg) scale(0); opacity:0; } 100% { transform:translate(400px,400px) rotate(-45deg) scale(0); opacity:0; } }
        .planet-pulse { animation: pulse 4s ease-in-out infinite alternate; }
        @keyframes pulse { 0% { box-shadow: 0 0 15px 5px var(--planet-color-shadow, rgba(100,100,255,0.5)); } 100% { box-shadow: 0 0 25px 10px var(--planet-color-shadow-strong, rgba(100,100,255,0.8)); } }
        .particles { background-image: radial-gradient(1px 1px at ${Math.random()*100}% ${Math.random()*100}%, rgba(100,100,255,0.3), transparent), radial-gradient(1px 1px at ${Math.random()*100}% ${Math.random()*100}%, rgba(100,100,255,0.3), transparent), radial-gradient(1px 1px at ${Math.random()*100}% ${Math.random()*100}%, rgba(100,100,255,0.3), transparent); background-size: 300px 300px; animation: drift 30s linear infinite; opacity:0.3; position:absolute; top:0; left:0; right:0; bottom:0; z-index:-1; }
        @keyframes drift { 0% { background-position:0 0; } 100% { background-position:300px 300px; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out forwards; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        .cursor-crosshair { cursor: crosshair; }
        `}
      </style>
    </div>
  );
};

export default Community;