
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNav from '../components/CategoryNav';
import { Link, QrCode, Copy, Check, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurationLinks = () => {
  const [links, setLinks] = useState([
    { id: 1, title: '디자인 스튜디오', url: 'https://peermall.com/design-studio', visits: 124 },
    { id: 2, title: '친환경 생활용품', url: 'https://peermall.com/eco-life', visits: 89 },
    { id: 3, title: '수제 베이커리', url: 'https://peermall.com/bakery', visits: 156 },
    { id: 4, title: '디지털 아트 갤러리', url: 'https://peermall.com/digital-art', visits: 73 },
  ]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(1);
  const [copied, setCopied] = useState(false);

  const selectedLink = links.find(link => link.id === selectedLinkId);

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) return;
    
    const newId = Math.max(0, ...links.map(l => l.id)) + 1;
    setLinks([...links, { ...newLink, id: newId, visits: 0 }]);
    setNewLink({ title: '', url: '' });
  };

  const handleDeleteLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
    if (selectedLinkId === id) {
      setSelectedLinkId(links[0]?.id || null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryNav />
      
      <main className="flex-grow bg-bg-100">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-primary-300 mb-2">큐레이션 링크</h1>
            <p className="text-text-200 mb-6">여러분의 피어몰과 콘텐츠를 하나의 링크로 관리하고 공유하세요.</p>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid md:grid-cols-3 min-h-[500px]">
                {/* 링크 목록 영역 */}
                <div className="border-r border-bg-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold">내 링크 목록</h2>
                    <span className="text-sm text-text-200">{links.length}개의 링크</span>
                  </div>
                  
                  <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                    {links.map(link => (
                      <div 
                        key={link.id}
                        onClick={() => setSelectedLinkId(link.id)}
                        className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                          selectedLinkId === link.id ? 'bg-primary-100' : 'hover:bg-bg-100'
                        }`}
                      >
                        <div className="flex-1 truncate">
                          <p className="font-medium truncate">{link.title}</p>
                          <p className="text-xs text-text-200 truncate">{link.url}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLink(link.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-text-200" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-bg-200 pt-4">
                    <h3 className="text-sm font-medium mb-2">새 링크 추가</h3>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="링크 제목"
                        value={newLink.title}
                        onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                        className="w-full p-2 text-sm border border-bg-200 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="URL (https://...)"
                        value={newLink.url}
                        onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                        className="w-full p-2 text-sm border border-bg-200 rounded-md"
                      />
                      <Button onClick={handleAddLink} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        링크 추가
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* 링크 미리보기 영역 */}
                <div className="col-span-2 p-6">
                  {selectedLink ? (
                    <>
                      <div className="flex justify-between mb-6">
                        <h2 className="text-xl font-bold">{selectedLink.title}</h2>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(`https://peermall.com/curated/${selectedLink.id}`)}>
                            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            {copied ? '복사됨' : '링크 복사'}
                          </Button>
                          <Button variant="outline" size="sm" as="a" href={selectedLink.url} target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            방문
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-bg-100 rounded-lg p-4 mb-6">
                        <p className="text-sm mb-2">큐레이션 링크:</p>
                        <div className="flex items-center bg-white p-2 rounded border border-bg-200">
                          <span className="text-sm truncate flex-1">https://peermall.com/curated/{selectedLink.id}</span>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(`https://peermall.com/curated/${selectedLink.id}`)}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-sm mb-2">원본 URL:</p>
                        <div className="flex items-center bg-white p-2 rounded border border-bg-200">
                          <span className="text-sm truncate flex-1">{selectedLink.url}</span>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(selectedLink.url)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start mb-6">
                        <div className="mr-6">
                          <p className="text-sm mb-2">Dynamic QR 코드:</p>
                          <div className="bg-white p-4 rounded shadow-md inline-block">
                            <QrCode className="h-32 w-32" />
                          </div>
                          <Button variant="outline" size="sm" className="mt-2 w-full">
                            QR 다운로드
                          </Button>
                        </div>
                        
                        <div>
                          <p className="text-sm mb-2">통계:</p>
                          <div className="bg-white p-4 rounded shadow-md">
                            <p className="font-bold text-2xl text-accent-200">{selectedLink.visits}</p>
                            <p className="text-text-200 text-sm">총 방문수</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">링크 사용법</h3>
                        <ol className="space-y-2 text-sm text-text-200">
                          <li className="flex items-start">
                            <span className="bg-accent-100 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                            <span>위 링크 주소나 QR 코드를 복사하세요.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-accent-100 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                            <span>이메일, 메시지, SNS 등 원하는 곳에 공유하세요.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-accent-100 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                            <span>사용자가 링크를 클릭하거나 QR 코드를 스캔하면 설정한 페이지로 이동합니다.</span>
                          </li>
                        </ol>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-text-200">
                      <Link className="h-16 w-16 mb-4" />
                      <p className="text-lg mb-2">링크를 선택하세요</p>
                      <p className="text-sm">왼쪽 목록에서 관리할 링크를 선택하세요.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-primary-100 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">다이나믹 링크로 더 많은 기능을 활용하세요</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">이메일 서비스, 디지털 명함, 전화등록부 시스템 등 다양한 기능을 모두 하나의 링크로 통합하세요.</p>
            <Button size="lg" className="bg-accent-100 hover:bg-accent-200">
              <Link className="h-5 w-5 mr-2" />
              다이나믹 링크 시작하기
            </Button>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CurationLinks;
