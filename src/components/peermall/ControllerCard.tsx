
import React from 'react';

interface ControllerCardProps {
  type: string;
  color: string;
  message: string;
  image: string;
}

const ControllerCard: React.FC<ControllerCardProps> = ({ type, color, message, image }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col card-hover">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold mb-1">{type}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <img src={image} alt={type} className="w-16 h-16 object-contain" />
      </div>
      <button className={`text-white text-sm font-medium py-1 px-4 rounded-md self-start ${color}`}>
        생성
      </button>
    </div>
  );
};

export default ControllerCard;
