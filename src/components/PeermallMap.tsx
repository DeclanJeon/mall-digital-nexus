import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  CircleMarker,
  Tooltip
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Define the PeerMall type
interface PeerMall {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  imageUrl?: string;
}

// Define the Category type
interface Category {
  name: string;
  color: string;
}

// Custom marker icon
const customMarkerIcon = (categoryColor: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${categoryColor}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Category color mapping
const categoryColors: { [key: string]: string } = {
  '음식점': 'red',
  '카페': 'green',
  '미용실': 'blue',
  '학원': 'yellow',
  '기타': 'grey',
};

// PeerMallMap Component
const PeerMallMap = () => {
  const [peerMalls, setPeerMalls] = useState<PeerMall[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routingWaypoints, setRoutingWaypoints] = useState<any[]>([]);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const mapRef = useRef<any>(null);

  // Sample categories
  const categories: Category[] = [
    { name: '전체', color: 'grey' },
    { name: '음식점', color: 'red' },
    { name: '카페', color: 'green' },
    { name: '미용실', color: 'blue' },
    { name: '학원', color: 'yellow' },
    { name: '기타', color: 'grey' },
  ];

  // Fetch PeerMall data (replace with your actual data source)
  useEffect(() => {
    const fetchPeerMalls = async () => {
      // Replace with your actual data fetching logic
      const mockData: PeerMall[] = [
        { id: 1, name: '피어몰 음식점', lat: 37.5665, lng: 126.9780, category: '음식점', description: '맛있는 음식점입니다.', imageUrl: '/path/to/image1.jpg' },
        { id: 2, name: '피어몰 카페', lat: 37.5680, lng: 126.9820, category: '카페', description: '분위기 좋은 카페입니다.', imageUrl: '/path/to/image2.jpg' },
        { id: 3, name: '피어몰 미용실', lat: 37.5640, lng: 126.9750, category: '미용실', description: '실력있는 미용실입니다.', imageUrl: '/path/to/image3.jpg' },
        { id: 4, name: '피어몰 학원', lat: 37.5670, lng: 126.9790, category: '학원', description: '최고의 학원입니다.', imageUrl: '/path/to/image4.jpg' },
        { id: 5, name: '피어몰 기타', lat: 37.5650, lng: 126.9770, category: '기타', description: '다양한 서비스 제공합니다.', imageUrl: '/path/to/image5.jpg' },
      ];
      setPeerMalls(mockData);
    };

    fetchPeerMalls();
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Filter PeerMalls by category
  const filteredPeerMalls = selectedCategory === '전체'
    ? peerMalls
    : peerMalls.filter(mall => mall.category === selectedCategory);

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle PeerMall selection for routing
  const handleMallSelect = (mall: PeerMall) => {
    if (!userLocation) {
      alert("Please allow location access to calculate the route.");
      return;
    }

    setRoutingWaypoints([
      { lat: userLocation[0], lng: userLocation[1] },
      { lat: mall.lat, lng: mall.lng }
    ]);
  };

  const handleRouteFound = (route: any) => {
    setRouteInfo(route);
  };

  const renderMarkers = useCallback(() => {
    return filteredPeerMalls.map(mall => (
      <Marker
        key={mall.id}
        position={[mall.lat, mall.lng]}
        icon={customMarkerIcon(categoryColors[mall.category] || 'grey')}
      >
        <Popup>
          <div>
            <h3>{mall.name}</h3>
            <p>{mall.description}</p>
            <button onClick={() => handleMallSelect(mall)}>
              Route to here
            </button>
          </div>
        </Popup>
      </Marker>
    ));
  }, [filteredPeerMalls, handleMallSelect]);

  // Routing control component
  const RoutingControl = ({ waypoints, onRouteFound }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
      if (!map || !waypoints || waypoints.length < 2) return;

      // Clean up previous routing control if it exists
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      const routingControl = L.Routing.control({
        waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving',
        }),
        showAlternatives: true,
        fitSelectedRoutes: true,
        show: false,
        lineOptions: {
          styles: [
            { color: 'black', opacity: 0.15, weight: 9 },
            { color: 'white', opacity: 0.8, weight: 6 },
            { color: 'blue', opacity: 0.5, weight: 2 }
          ],
          extendToWaypoints: false,
          missingRouteTolerance: 0
        },
        addWaypoints: false,
        routeWhileDragging: false,
        createMarker: () => null, // Disable default markers
      }).addTo(map);

      routingControl.on('routesfound', function (e) {
        if (e.routes.length > 0) {
          onRouteFound(e.routes[0]);
        }
      });

      routingControlRef.current = routingControl;

      return () => {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
        }
      };
    }, [map, waypoints, onRouteFound]);

    return null;
  };

  const MemoizedRoutingControl = memo(RoutingControl);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">피어몰 스토어 지도</h2>
      <div className="mb-4">
        {categories.map(category => (
          <button
            key={category.name}
            className={`mr-2 px-4 py-2 rounded-full ${selectedCategory === category.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleCategorySelect(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="h-[600px] w-full">
        <MapContainer
          center={userLocation || [37.5665, 126.9780]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocation && (
            <CircleMarker center={userLocation} radius={5} color="red">
              <Tooltip>You are here</Tooltip>
            </CircleMarker>
          )}
          {renderMarkers()}
          {routingWaypoints.length > 1 && (
            <MemoizedRoutingControl waypoints={routingWaypoints} onRouteFound={handleRouteFound} />
          )}
        </MapContainer>
      </div>
      {routeInfo && (
        <div className="mt-4">
          <h3 className="font-bold">Route Information</h3>
          <p>Distance: {routeInfo.summary.totalDistance / 1000} km</p>
          <p>Time: {Math.floor(routeInfo.summary.totalTime / 60)} minutes</p>
        </div>
      )}
    </div>
  );
};

export default PeerMallMap;
