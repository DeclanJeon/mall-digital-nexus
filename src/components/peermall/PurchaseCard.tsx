
import React from 'react';

interface PurchaseCardProps {
  title: string;
  platform: string;
  date: string;
  time: string;
  image: string;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ title, platform, date, time, image }) => {
  return (
    <div className="flex items-center gap-4 p-3 border-b border-peermall-light-gray last:border-0">
      <img src={image} alt={title} className="w-12 h-12 rounded object-cover" />
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{platform}</p>
      </div>
      <div className="text-right">
        <p className="text-sm">{date}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <button className="bg-peermall-light-gray text-xs px-4 py-1.5 rounded-md hover:bg-peermall-gray transition-colors">
        다운로드
      </button>
    </div>
  );
};

export default PurchaseCard;
