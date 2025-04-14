
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

interface PeermallMapProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: Location | null;
  allLocations: Location[];
}

// Component to handle map center changes
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const PeermallMap = ({ isOpen, onClose, selectedLocation, allLocations }: PeermallMapProps) => {
  if (!isOpen || !selectedLocation) return null;
  
  const mapCenter: [number, number] = [selectedLocation.lat, selectedLocation.lng];
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {selectedLocation.title} - {selectedLocation.address}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            닫기
          </button>
        </div>
        
        <div className="flex-grow overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Selected location marker */}
            <Marker 
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={L.icon({
                iconUrl: icon,
                shadowUrl: iconShadow,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                className: 'selected-marker' // Custom class for styling
              })}
            >
              <Popup>
                <div>
                  <strong>{selectedLocation.title}</strong>
                  <p>{selectedLocation.address}</p>
                </div>
              </Popup>
            </Marker>
            
            {/* All other locations */}
            {allLocations
              .filter(loc => loc.lat !== selectedLocation.lat || loc.lng !== selectedLocation.lng)
              .map((location, index) => (
                <Marker
                  key={index}
                  position={[location.lat, location.lng]}
                >
                  <Popup>
                    <div>
                      <strong>{location.title}</strong>
                      <p>{location.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default PeermallMap;
