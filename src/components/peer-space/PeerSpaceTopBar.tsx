import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, QrCode, Settings, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PeerSpaceData } from "./types";

interface PeerSpaceTopBarProps {
  data: PeerSpaceData;
  isOwner: boolean;
  isFollowing: boolean;
  onFollow: () => void;
  onMessage: () => void;
  onQRGenerate: () => void;
  onSettings: () => void;
}

const PeerSpaceTopBar = ({
  data,
  isOwner,
  isFollowing,
  onFollow,
  onMessage,
  onQRGenerate,
  onSettings
}: PeerSpaceTopBarProps) => (
  <div className="bg-gradient-to-r from-primary-200 to-primary-300 text-white">
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Avatar className="h-12 w-12 mr-4 border-2 border-white">
            <AvatarImage src={data.profileImage} alt={data.owner} />
            <AvatarFallback>{data.owner.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{data.title}</h1>
            <div className="flex items-center text-sm">
              <span>{data.owner}</span>
              <div className="mx-2">•</div>
              <span>Peer #{data.peerNumber}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!isOwner && (
            <>
              <Button 
                variant="secondary" 
                size="sm" 
                className={`rounded-full ${isFollowing ? 'bg-white text-primary-300' : ''}`}
                onClick={onFollow}
              >
                <Star className="h-4 w-4 mr-1" />
                {isFollowing ? '팔로우됨' : '팔로우'}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="rounded-full"
                onClick={onMessage}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                메시지
              </Button>
            </>
          )}
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full"
            onClick={onQRGenerate}
          >
            <QrCode className="h-4 w-4 mr-1" />
            QR 코드
          </Button>
          
          {isOwner && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-full"
              onClick={onSettings}
            >
              <Settings className="h-4 w-4 mr-1" />
              설정
            </Button>
          )}
        </div>
      </div>
      
      {/* Badges Row */}
      <div className="flex flex-wrap items-center mt-2 gap-2">
        {data.badges.map((badge, index) => (
          <Badge key={index} variant="secondary" className="bg-white/20 text-white">
            {badge}
          </Badge>
        ))}
        <div className="flex items-center ml-2">
          <Star className="h-4 w-4 text-yellow-300 mr-1" />
          <span className="text-sm">{data.recommendations} 추천</span>
        </div>
        <div className="flex items-center ml-2">
          <User className="h-4 w-4 mr-1" />
          <span className="text-sm">{data.followers} 팔로워</span>
        </div>
      </div>
    </div>
  </div>
);

export default PeerSpaceTopBar;
