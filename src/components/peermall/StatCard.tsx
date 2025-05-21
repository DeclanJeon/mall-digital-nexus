
import React from 'react';

interface StatCardProps {
  title: string;
  session: string;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, session, percentage, color, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm card-hover flex items-center gap-4 animate-fade-in">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">{title}</h3>
          <span className="text-xs text-muted-foreground">{session}</span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-value ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs font-semibold">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
