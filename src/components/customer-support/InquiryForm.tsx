
import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const InquiryForm = () => {
  const [formState, setFormState] = useState({
    category: '',
    title: '',
    content: '',
    attachments: [] as File[],
    requestTIE: false,
    isSubmitted: false,
    isPreviewOpen: false
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormState(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };
  
  const removeAttachment = (index: number) => {
    setFormState(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Submitting form:', formState);
    
    // Simulate a successful submission
    setFormState(prev => ({
      ...prev,
      isSubmitted: true
    }));
  };
  
  if (formState.isSubmitted) {
    return (
      <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-[#d4eaf7] flex items-center justify-center text-[#00668c]">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">문의가 접수되었습니다</h2>
          <p className="text-gray-600 mb-6">
            문의번호: INQ-2023-05-07-1234<br/>
            예상 응답 시간: 24시간 이내
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              className="border-[#71c4ef] text-[#71c4ef]"
              onClick={() => setFormState(prev => ({ ...prev, isSubmitted: false }))}
            >
              새로운 문의하기
            </Button>
            <Button 
              className="bg-[#00668c] hover:bg-[#00668c]/90"
              onClick={() => window.location.reload()}
            >
              문의 내역 보기
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">1:1 문의하기</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="category" className="text-base">문의 유형</Label>
            </div>
            <div className="md:col-span-3">
              <Select
                value={formState.category}
                onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="문의 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">계정 관련</SelectItem>
                  <SelectItem value="mall">피어몰 운영</SelectItem>
                  <SelectItem value="tie">TIE/VI 이용</SelectItem>
                  <SelectItem value="payment">결제/환불</SelectItem>
                  <SelectItem value="report">신고/분쟁</SelectItem>
                  <SelectItem value="other">기타 문의</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="title" className="text-base">제목</Label>
            </div>
            <div className="md:col-span-3">
              <Input
                id="title"
                value={formState.title}
                onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                placeholder="제목을 입력하세요"
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="content" className="text-base">내용</Label>
            </div>
            <div className="md:col-span-3">
              <Textarea
                id="content"
                value={formState.content}
                onChange={(e) => setFormState(prev => ({ ...prev, content: e.target.value }))}
                placeholder="문의 내용을 자세히 입력해주세요"
                className="min-h-[200px] w-full"
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="attachments" className="text-base">첨부 파일</Label>
            </div>
            <div className="md:col-span-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-600">파일을 드래그하여 업로드하거나 클릭하세요</p>
                <p className="text-xs text-gray-500 mb-3">최대 5개 파일, 파일당 10MB 이하</p>
                <Input
                  id="attachments"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-[#71c4ef] text-[#71c4ef]"
                  onClick={() => document.getElementById('attachments')?.click()}
                >
                  파일 선택
                </Button>
              </div>
              
              {formState.attachments.length > 0 && (
                <div className="space-y-2">
                  {formState.attachments.map((file, index) => (
                    <div key={index} className="flex justify-between items-center bg-[#f5f4f1] rounded p-2">
                      <span className="truncate text-sm">{file.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-red-500 hover:text-red-700 hover:bg-transparent p-0 px-2"
                        onClick={() => removeAttachment(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label className="text-base">추가 옵션</Label>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="tie-request" className="cursor-pointer">TIE 연결 요청</Label>
                  <p className="text-sm text-gray-500">실시간 상담이 필요하신 경우 선택하세요</p>
                </div>
                <Switch
                  id="tie-request"
                  checked={formState.requestTIE}
                  onCheckedChange={(checked) => setFormState(prev => ({ ...prev, requestTIE: checked }))}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Collapsible
          open={formState.isPreviewOpen}
          onOpenChange={(open) => setFormState(prev => ({ ...prev, isPreviewOpen: open }))}
          className="border border-[#cccbc8] rounded-lg mb-6"
        >
          <CollapsibleTrigger className="flex justify-between items-center w-full p-4 hover:bg-[#f5f4f1]">
            <span className="font-medium">문의 내용 미리보기</span>
            <span>{formState.isPreviewOpen ? '접기' : '펼치기'}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border-t border-[#cccbc8] bg-[#f5f4f1]">
            {formState.title && formState.content ? (
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium mb-1">제목</h3>
                  <p className="text-gray-700">{formState.title}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">내용</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{formState.content}</p>
                </div>
                {formState.category && (
                  <div>
                    <h3 className="font-medium mb-1">문의 유형</h3>
                    <p className="text-gray-700">{formState.category}</p>
                  </div>
                )}
                {formState.attachments.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-1">첨부 파일</h3>
                    <ul className="list-disc pl-5">
                      {formState.attachments.map((file, index) => (
                        <li key={index} className="text-gray-700">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {formState.requestTIE && (
                  <div className="flex items-center gap-2 text-[#00668c]">
                    <AlertTriangle className="h-4 w-4" />
                    <span>TIE 연결 요청이 포함됩니다.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>문의 제목과 내용을 입력하시면 미리보기가 표시됩니다.</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        <div className="border-t border-[#cccbc8] pt-6 mt-6">
          <div className="flex flex-col md:flex-row gap-3 justify-end">
            <Button type="button" variant="outline">취소</Button>
            <Button 
              type="submit" 
              className="bg-[#00668c] hover:bg-[#00668c]/90"
              disabled={!formState.category || !formState.title || !formState.content}
            >
              문의 제출하기
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
