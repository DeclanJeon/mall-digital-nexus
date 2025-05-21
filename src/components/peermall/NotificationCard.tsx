
import React from 'react';
import { MoreVertical } from 'lucide-react';

interface NotificationCardProps {
  title: string;
  message: string;
  time: string;
  icon: React.ReactNode;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ title, message, time, icon }) => {
  return (
    <div className="notification-item">
      <div className="bg-peermall-light-blue rounded-lg p-2 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{title}</h3>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{message}</p>
        <span className="text-[10px] text-peermall-blue font-medium">{time}</span>
      </div>
    </div>
  );
};

export default NotificationCard;
