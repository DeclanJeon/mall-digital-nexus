
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CustomerSupportHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <header className="bg-[#d4eaf7] border-b border-[#b6ccd8]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Link to="/" className="mr-8 flex items-center">
              <h1 className="text-2xl font-bold text-primary-300">PeerMall</h1>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-xl font-semibold text-[#00668c]">고객센터</span>
            </Link>
          </div>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="무엇을 도와드릴까요?"
                className="pl-10 pr-4 py-2 w-full bg-white border border-[#b6ccd8] rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Button 
                type="submit" 
                className="absolute right-1 top-1 bg-[#00668c] hover:bg-[#00668c]/90 text-white h-8 rounded-full"
              >
                검색
              </Button>
            </div>
          </form>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-[#b6ccd8]">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[#71c4ef] flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">피어 사용자</p>
                <p className="text-xs text-gray-500">P-12345-6789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerSupportHeader;
