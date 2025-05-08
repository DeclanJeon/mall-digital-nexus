import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, User, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatePeermallModal from '@/components/peermall-features/CreatePeermallModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Peermall {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl: string;
  owner: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMySpacesOpen, setIsMySpacesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mySpaces, setMySpaces] = useState<Peermall[]>([]);
  const navigate = useNavigate();

  const handleCreateModalOpen = () => setIsCreateModalOpen(true);
  const handleCreateModalClose = () => setIsCreateModalOpen(false);
  
  const handleOpenMySpaces = () => {
    loadMySpaces();
    setIsMySpacesOpen(true);
  };
  
  const handleCloseMySpaces = () => {
    setIsMySpacesOpen(false);
  };

  // Load my spaces from localStorage
  const loadMySpaces = () => {
    try {
      const storedPeermalls = localStorage.getItem('peermalls');
      if (storedPeermalls) {
        const allPeermalls = JSON.parse(storedPeermalls);
        const filteredSpaces = allPeermalls.filter((mall: Peermall) => mall.owner === '나');
        setMySpaces(filteredSpaces);
      }
    } catch (error) {
      console.error('Error loading my spaces from localStorage:', error);
    }
  };

  const handleSelectSpace = (id: string) => {
    handleCloseMySpaces();
    navigate(`/space/${id}`);
  };

  // Handle successful peermall creation
  const handleCreateSuccess = (peermallData: { name: string; type: string; id: string }) => {
    // Close modal
    handleCreateModalClose();
    
    // Navigate to the new peermall
    navigate(`/space/${peermallData.id}`);
  };

  useEffect(() => {
    // Check if user is logged in using localStorage
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    
    // Initial load of my spaces
    if (userLoggedIn) {
      loadMySpaces();
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    window.location.reload(); // Refresh to update all components
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-300">
            PeerMall
          </Link>

          {/* Search Bar (desktop) */}
          <div className="hidden md:flex items-center flex-1 mx-8">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-200"
                placeholder="피어몰, 피어스페이스, 콘텐츠 검색... "
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation Links (desktop) */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/shopping" className="text-text-200 hover:text-primary-300">쇼핑</Link>
            {/* <Link to="/curation-links" className="text-text-200 hover:text-primary-300">큐레이션</Link> */}
            <Link to="/community" className="text-text-200 hover:text-primary-300">커뮤니티</Link>
            {/* <Link to="/customer-support" className="text-text-200 hover:text-primary-300">고객센터</Link> */}
            
            {isLoggedIn && (
              <>
                <button 
                  onClick={handleOpenMySpaces}
                  className="text-accent-200 hover:text-accent-100"
                >
                  내 스페이스
                </button>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  피어몰 만들기
                </button>
              </>
            )}
          </nav>

          {/* User Actions (desktop) */}
          <div className="hidden md:flex items-center ml-6">
            <button className="p-2 relative">
              <Bell className="h-5 w-5 text-text-200 hover:text-primary-300" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full h-2 w-2"></span>
            </button>
            
            {isLoggedIn ? (
              <div className="relative ml-4">
                <div 
                  className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-white cursor-pointer"
                  onClick={() => setIsMenuOpen(prev => !prev)}
                >
                  <User className="h-5 w-5" />
                </div>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link to="/my-info" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">내 정보</Link>
                    <button 
                      onClick={handleOpenMySpaces}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      내 스페이스
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={handleLogin}
                className="ml-4 bg-primary-300 hover:bg-primary-400 text-white"
              >
                로그인
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-text-200" />
            ) : (
              <Menu className="h-6 w-6 text-text-200" />
            )}
          </button>
        </div>

        {/* Search Bar (mobile) */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-200"
              placeholder="피어몰, 피어스페이스, 콘텐츠 검색..."
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link to="/shopping" className="py-2 text-text-200 hover:text-primary-300">쇼핑</Link>
              <Link to="/curation-links" className="py-2 text-text-200 hover:text-primary-300">큐레이션</Link>
              <Link to="/community" className="py-2 text-text-200 hover:text-primary-300">커뮤니티</Link>
              {isLoggedIn && (
                <>
                  <button 
                    onClick={handleOpenMySpaces}
                    className="py-2 text-left text-accent-200 hover:text-accent-100"
                  >
                    내 스페이스
                  </button>
                  <button 
                    onClick={handleCreateModalOpen}
                    className="py-2 text-left text-accent-200 hover:text-accent-100"
                  >
                    피어몰 만들기
                  </button>
                </>
              )}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-text-200" />
                  <span className="ml-2 text-text-200">알림</span>
                </div>
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
              </div>
              {isLoggedIn ? (
                <>
                  <Link to="/my-info" className="py-2 text-text-200 hover:text-primary-300">내 정보</Link>
                  <button 
                    onClick={handleLogout}
                    className="py-2 text-left text-text-200 hover:text-primary-300"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Button 
                  onClick={handleLogin}
                  className="mt-2 w-full bg-primary-300 hover:bg-primary-400 text-white"
                >
                  로그인
                </Button>
              )}
            </nav>
          </div>
        </div>
      )}
      
      {/* My Spaces Dialog */}
      <Dialog open={isMySpacesOpen} onOpenChange={handleCloseMySpaces}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>내 스페이스</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {mySpaces.length > 0 ? (
              mySpaces.map((space) => (
                <div 
                  key={space.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectSpace(space.id)}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4">
                    <img 
                      src={space.imageUrl} 
                      alt={space.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{space.title}</h3>
                    <p className="text-sm text-gray-500">{space.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">생성된 스페이스가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">새로운 피어몰을 만들어보세요!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <CreatePeermallModal 
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSuccess={handleCreateSuccess}
      />
    </header>
  );
};

export default Header;
