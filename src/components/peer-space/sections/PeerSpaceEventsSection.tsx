import React from 'react';
import { Event, PeerMallConfig } from '../types'; // PeerMallConfig 추가

interface PeerSpaceEventsProps {
  events: Event[];
  // quests: any[]; // quests prop이 사용되지 않는다면 제거, 필요하다면 타입을 명확히 정의
  isOwner?: boolean; // 소유자 여부 (옵셔널)
  config?: PeerMallConfig; // config prop 추가 (옵셔널, 필요에 따라 사용)
}

const PeerSpaceEventsSection: React.FC<PeerSpaceEventsProps> = ({ events, isOwner, config }) => {
  // config나 isOwner를 사용하여 조건부 렌더링 또는 다른 로직 추가 가능
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">이벤트</h2>
      </div>
      
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-gray-500">{event.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <p className="text-gray-500">등록된 이벤트가 없습니다.</p>
        </div>
      )}
    </section>
  );
};

export default PeerSpaceEventsSection;
