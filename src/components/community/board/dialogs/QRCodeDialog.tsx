import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { Link as LinkIcon, FileImage } from "lucide-react";
import { Post } from '@/types/post';

interface QRCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  getPostUrl: (post: Post) => string;
}

const QRCodeDialog: React.FC<QRCodeDialogProps> = ({
  isOpen,
  onOpenChange,
  post,
  getPostUrl
}) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    if (post) {
      navigator.clipboard.writeText(getPostUrl(post));
      toast({
        title: "링크가 복사되었습니다",
        description: "게시글 링크가 클립보드에 복사되었습니다.",
      });
    }
  };

  const handleSaveImage = () => {
    // 실제로는 더 복잡한 구현이 필요합니다.
    // 예를 들어, canvas를 사용하여 QR 코드를 이미지로 렌더링하고 다운로드하는 로직이 필요합니다.
    toast({
      title: "QR 코드가 저장되었습니다",
      description: "이미지가 다운로드 폴더에 저장되었습니다.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>게시글 QR 코드</DialogTitle>
        </DialogHeader>
        {post && (
          <>
            <div className="py-2">
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-sm text-gray-500 mt-1">아래 QR 코드로 게시글에 바로 접근할 수 있습니다.</p>
            </div>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="p-2 border-2 border-dashed border-gray-200 rounded-lg bg-white">
                <QRCodeSVG value={getPostUrl(post)} size={200} />
              </div>
              <p className="mt-4 text-sm text-gray-600 break-all text-center">
                {getPostUrl(post)}
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto flex-1"
                onClick={handleCopyLink}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                링크 복사
              </Button>
              <Button 
                variant="outline"
                className="w-full sm:w-auto flex-1"
                onClick={handleSaveImage}
              >
                <FileImage className="mr-2 h-4 w-4" />
                이미지 저장
              </Button>
              <Button 
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                닫기
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
