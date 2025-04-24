
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Users,
  Home,
  Download,
  Gamepad2,
  Star,
  HelpCircle,
  Settings,
  Plus
} from 'lucide-react';
import SpaceCard from '@/components/peer-space/SpaceCard';
import { Space } from '@/components/peer-space/types';

const spaces: Space[] = [
  {
    id: '1',
    title: 'Art & Expression',
    imageUrl: 'public/lovable-uploads/1737af98-2044-4407-b615-e29b1e96054c.png',
    memberCount: 15,
    peopleOnline: 0,
    postCount: 0,
    isAdult: false
  },
  {
    id: '2',
    title: 'A Night time Jungle Party',
    imageUrl: 'public/lovable-uploads/519d89eb-e224-46be-9aa2-7fb030141693.png',
    memberCount: 62,
    peopleOnline: 0,
    postCount: 1,
    isAdult: false
  },
  {
    id: '3',
    title: 'A Podcast Basement',
    imageUrl: 'public/lovable-uploads/f4d7c585-b378-40ac-afc8-6e36a430cb22.png',
    memberCount: 38,
    peopleOnline: 0,
    postCount: 0,
    isAdult: false
  },
  {
    id: '4',
    title: "A Raccoon's Campfire",
    imageUrl: 'public/lovable-uploads/7acac5d5-5357-4b08-8889-138a979a0896.png',
    memberCount: 39,
    peopleOnline: 0,
    postCount: 0,
    isAdult: false
  }
];

const PeerSpace2 = () => {
  const [showFeatured, setShowFeatured] = useState(true);

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 fixed h-screen bg-[#1A1F2C] border-r border-white/10 p-4 flex flex-col">
          <div className="mb-8">
            <img src="public/lovable-uploads/a3089691-5809-4ae1-b8ca-c90ba0c7f294.png" alt="Logo" className="h-8" />
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search SideQuest..." 
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>

          <nav className="space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/get-sidequest" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <Download className="h-5 w-5" />
              <span>Get SideQuest</span>
            </Link>
            <Link to="/apps-and-games" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <Gamepad2 className="h-5 w-5" />
              <span>Apps and Games</span>
            </Link>
            <Link to="/spaces" className="flex items-center gap-3 px-4 py-2 bg-white/10 text-white rounded-lg">
              <Users className="h-5 w-5" />
              <span>Spaces</span>
            </Link>
            <Link to="/giveaways" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <Star className="h-5 w-5" />
              <span>Giveaways</span>
            </Link>
            <Link to="/help" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <HelpCircle className="h-5 w-5" />
              <span>Help & Support</span>
            </Link>
          </nav>

          <div className="mt-auto space-y-2">
            <Link to="/developer-portal" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <Settings className="h-5 w-5" />
              <span>Developer Portal</span>
            </Link>
            <Link to="/feedback" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <HelpCircle className="h-5 w-5" />
              <span>Give us feedback</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Spaces</h1>
                <p className="text-gray-400">2,623 spaces created since December 2020</p>
              </div>
              <Button className="bg-[#E91E63] hover:bg-[#C2185B] text-white">
                Sign up now
              </Button>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="search spaces..." 
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-400">Show Featured Banter Spaces</span>
                <Switch 
                  checked={showFeatured}
                  onCheckedChange={setShowFeatured}
                  className="data-[state=checked]:bg-[#E91E63]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {spaces.map(space => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PeerSpace2;
