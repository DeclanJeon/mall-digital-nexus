
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Copy, Check, QrCode } from 'lucide-react';
import Header from '../components/CategoryNav';
import Footer from '../components/layout/Footer';

const CurationLinks = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [links, setLinks] = useState<Array<{title: string, url: string}>>([
    { title: "피어몰 홈페이지", url: "https://peermall.com" },
    { title: "제품 카탈로그", url: "https://peermall.com/catalog" },
    { title: "고객 지원", url: "https://peermall.com/support" },
  ]);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [generatedLink, setGeneratedLink] = useState("");
  const [linkName, setLinkName] = useState("");

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setLinks([...links, newLink]);
      setNewLink({ title: "", url: "" });
    }
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const generateCurationLink = () => {
    // This would actually generate a unique link or QR code
    // For now, we'll just create a mock URL
    setGeneratedLink(`https://peermall.com/links/${linkName.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 10000)}`);
    setActiveTab("share");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-bg-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Dynamic Links 생성</h1>
              <p className="text-text-200">다양한 피어몰 링크들을 하나로 묶어 쉽게 공유하고 관리하세요.</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="create">링크 큐레이션</TabsTrigger>
                <TabsTrigger value="customize">꾸미기</TabsTrigger>
                <TabsTrigger value="share">공유하기</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>큐레이션 링크 이름</CardTitle>
                    <CardDescription>이 큐레이션 링크를 어떻게 부를까요?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="name">링크 이름</Label>
                      <Input 
                        id="name" 
                        placeholder="예: 내 피어몰 링크 모음" 
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>링크 추가</CardTitle>
                    <CardDescription>큐레이션에 포함할 링크를 추가하세요.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">링크 제목</Label>
                          <Input 
                            id="title" 
                            placeholder="예: 우리 상점 메인" 
                            value={newLink.title}
                            onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="url">URL</Label>
                          <Input 
                            id="url" 
                            placeholder="https://..." 
                            value={newLink.url}
                            onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddLink} disabled={!newLink.title || !newLink.url}>
                        링크 추가
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {links.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>추가된 링크 {links.length}개</CardTitle>
                      <CardDescription>추가한 링크를 확인하세요.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {links.map((link, index) => (
                          <div key={index} className="flex items-center justify-between bg-bg-200 p-3 rounded-lg">
                            <div>
                              <p className="font-medium">{link.title}</p>
                              <p className="text-sm text-text-200 truncate max-w-xs md:max-w-md">{link.url}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeLink(index)}>
                              삭제
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={generateCurationLink}
                        disabled={!linkName || links.length === 0}
                      >
                        큐레이션 링크 생성하기
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="customize">
                <Card>
                  <CardHeader>
                    <CardTitle>링크 꾸미기</CardTitle>
                    <CardDescription>큐레이션 링크의 모양을 개성있게 꾸며보세요.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>테마 선택</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {["기본", "모던", "클래식", "팝"].map(theme => (
                            <div key={theme} className="border rounded-lg p-4 text-center cursor-pointer hover:border-accent-100">
                              {theme}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">설명 (선택사항)</Label>
                        <Textarea 
                          id="description" 
                          placeholder="이 링크 모음에 대한 설명을 입력하세요." 
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => setActiveTab("share")}>
                      다음: 공유하기
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="share">
                <Card>
                  <CardHeader>
                    <CardTitle>공유하기</CardTitle>
                    <CardDescription>큐레이션 링크가 생성되었습니다! 이제 공유해보세요.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedLink ? (
                        <>
                          <div className="relative">
                            <Input 
                              value={generatedLink} 
                              readOnly
                              className="pr-24"
                            />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="absolute right-1 top-1"
                              onClick={copyToClipboard}
                            >
                              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                              {copied ? "복사됨" : "복사"}
                            </Button>
                          </div>
                          
                          <div className="bg-bg-200 p-6 rounded-lg flex flex-col items-center justify-center space-y-4">
                            <QrCode size={150} />
                            <p className="text-sm text-text-200">Dynamic Link QR 코드</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm">
                              <Link to={generatedLink} target="_blank" className="flex items-center">
                                <ExternalLink className="h-4 w-4 mr-1" /> 링크 열기
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">다운로드</Button>
                            <Button variant="outline" size="sm">문자 전송</Button>
                            <Button variant="outline" size="sm">이메일 전송</Button>
                            <Button variant="outline" size="sm">카카오톡 공유</Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-text-200">먼저 '링크 큐레이션' 탭에서 큐레이션 링크를 생성해주세요.</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setActiveTab("create")}
                          >
                            링크 큐레이션으로 이동
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CurationLinks;
