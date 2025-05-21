
import React from 'react';

interface FriendRequestCardProps {
  name: string;
  domain: string;
  avatar: string;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ name, domain, avatar }) => {
  return (
    <div className="flex items-center justify-between p-2.5">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <h4 className="font-medium text-sm">{name}</h4>
          <p className="text-xs text-muted-foreground">{domain}</p>
        </div>
      </div>
      <button className="bg-peermall-blue text-white text-xs px-3 py-1 rounded-md">
        수락
      </button>
    </div>
  );
};

export default FriendRequestCard;
