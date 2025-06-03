export interface EnhancedMessageModalProps {
  messageModalOpen: boolean;
  setMessageModalOpen: (open: boolean) => void;
  owner: string;
  title: string;
  email?: string; // 🚀 이 부분 추가
  displayImageUrl?: string;
  imageError?: boolean;
}

export default function EnhancedMessageModal({ 
  messageModalOpen, 
  setMessageModalOpen, 
  owner, 
  email, // 🚀 이 부분 추가
  title, 
  displayImageUrl, 
  imageError, 
}: EnhancedMessageModalProps) {