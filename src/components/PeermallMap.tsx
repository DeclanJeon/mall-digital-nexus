import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

// Leaflet 이미지 경로 설정 (webpack 사용 시 필요)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

interface PeermallMapProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: { lat: number; lng: number; address: string; title: string } | null;
  allLocations: { lat: number; lng: number; address: string; title: string }[];
}

const PeermallMap: React.FC<PeermallMapProps> = ({ isOpen, onClose, selectedLocation, allLocations }) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);
  const [startAddress, setStartAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
	const [duration, setDuration] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRouteCalculated, setIsRouteCalculated] = useState(false);
  const [isStartAddressValid, setIsStartAddressValid] = useState(true);
  const [isDestinationAddressValid, setIsDestinationAddressValid] = useState(true);
  const [searchRadius, setSearchRadius] = useState(1);
  const [filteredLocations, setFilteredLocations] = useState(allLocations);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const [isRadiusDialogOpen, setIsRadiusDialogOpen] = useState(false);
  const [isAddressSearchDialogOpen, setIsAddressSearchDialogOpen] = useState(false);
  const [addressSearchResult, setAddressSearchResult] = useState<any>(null);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [isAddressSearchResultValid, setIsAddressSearchResultValid] = useState(true);
  const [isAddressSearchLoading, setIsAddressSearchLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast()

  const categories = [
    { value: '전체', label: '전체' },
    { value: '음식점', label: '음식점' },
    { value: '카페', label: '카페' },
    { value: '미용실', label: '미용실' },
    { value: '병원', label: '병원' },
    { value: '약국', label: '약국' },
    { value: '편의점', label: '편의점' },
    { value: '마트', label: '마트' },
    { value: '주차장', label: '주차장' },
    { value: '기타', label: '기타' },
  ];

  const routeOptions = {
    styles: [
      { color: 'black', opacity: 0.15, weight: 9 },
      { color: 'white', opacity: 0.8, weight: 6 },
      { color: '#4A90E2', opacity: 1, weight: 3 }
    ],
    extendToWaypoints: true,
    missingRouteTolerance: 1
  };

  const isValidCoordinates = (lat: number, lng: number) => {
    return typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng);
  };

  const handleAddressSearch = async () => {
    setIsAddressSearchLoading(true);
    setIsAddressSearchResultValid(true);
    try {
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${addressSearchQuery}&format=jsonv2`;
      const response = await fetch(geocodingUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        setAddressSearchResult({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name
        });
        setIsAddressSearchDialogOpen(false);
      } else {
        setAddressSearchResult(null);
        setIsAddressSearchResultValid(false);
      }
    } catch (error) {
      console.error('Error during address search:', error);
      setAddressSearchResult(null);
      setIsAddressSearchResultValid(false);
    } finally {
      setIsAddressSearchLoading(false);
    }
  };

  const handleRadiusChange = (value: number[]) => {
    setSearchRadius(value[0]);
  };

  const filterLocationsByRadius = useCallback(() => {
    if (!addressSearchResult || !mapInstance) {
      return;
    }

    const center = L.latLng(addressSearchResult.lat, addressSearchResult.lng);

    const filtered = allLocations.filter(location => {
      const locationLatLng = L.latLng(location.lat, location.lng);
      const distance = center.distanceTo(locationLatLng); // meters

      return distance <= searchRadius * 1000; // Convert km to meters
    });

    setFilteredLocations(filtered);
  }, [addressSearchResult, allLocations, searchRadius, mapInstance]);

  useEffect(() => {
    if (addressSearchResult) {
      filterLocationsByRadius();
    }
  }, [addressSearchResult, filterLocationsByRadius]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setIsCategoryDialogOpen(false);
  };

  const filterLocationsByCategory = useCallback(() => {
    if (!selectedCategory || selectedCategory === '전체') {
      return allLocations;
    }

    // 여기에 카테고리 필터링 로직을 추가하세요.
    // 예를 들어, 각 location 객체에 category 속성이 있다고 가정합니다.
    const filtered = allLocations.filter(location => {
      // location.category가 selectedCategory와 일치하는지 확인
      return true;
    });

    return filtered;
  }, [allLocations, selectedCategory]);

  useEffect(() => {
    const filtered = filterLocationsByCategory();
    setFilteredLocations(filtered);
  }, [filterLocationsByCategory]);

  const calculateRoute = useCallback(async () => {
    setIsStartAddressValid(true);
    setIsDestinationAddressValid(true);

    if (!startAddress) {
      setIsStartAddressValid(false);
      return;
    }

    if (!destinationAddress) {
      setIsDestinationAddressValid(false);
      return;
    }

    try {
      const startGeocodingUrl = `https://nominatim.openstreetmap.org/search?q=${startAddress}&format=jsonv2`;
      const destinationGeocodingUrl = `https://nominatim.openstreetmap.org/search?q=${destinationAddress}&format=jsonv2`;

      const startResponse = await fetch(startGeocodingUrl);
      const destinationResponse = await fetch(destinationGeocodingUrl);

      const startData = await startResponse.json();
      const destinationData = await destinationResponse.json();

      if (!startData || startData.length === 0) {
        setIsStartAddressValid(false);
        return;
      }

      if (!destinationData || destinationData.length === 0) {
        setIsDestinationAddressValid(false);
        return;
      }

      const startLatLng = L.latLng(parseFloat(startData[0].lat), parseFloat(startData[0].lon));
      const destinationLatLng = L.latLng(parseFloat(destinationData[0].lat), parseFloat(destinationData[0].lon));

      if (!isValidCoordinates(startLatLng.lat, startLatLng.lng) || !isValidCoordinates(destinationLatLng.lat, destinationLatLng.lng)) {
        toast({
          title: "경로 계산 실패",
          description: "잘못된 좌표입니다.",
        })
        return;
      }

      if (!mapInstance) {
        toast({
          title: "경로 계산 실패",
          description: "지도 인스턴스를 불러오지 못했습니다.",
        })
        return;
      }

      if (routingControl) {
        mapInstance.removeControl(routingControl);
      }

      const newRoutingControl = L.Routing.control({
        waypoints: [startLatLng, destinationLatLng],
        routeWhileDragging: false,
        showAlternatives: false,
        useMapbox: false,
        lineOptions: routeOptions,
        geocoder: L.Control.Geocoder.nominatim(),
      });

      newRoutingControl.addTo(mapInstance);

      newRoutingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        setDistance(route.summary.totalDistance / 1000);
        setDuration(route.summary.totalTime / 60);
        setIsRouteCalculated(true);
      });

      newRoutingControl.on('routingerror', (e) => {
        toast({
          title: "경로 계산 실패",
          description: "경로를 찾을 수 없습니다. 주소를 다시 확인해주세요.",
        })
      });

      setRoutingControl(newRoutingControl);
      setIsRouteCalculated(true);
      setIsRouteDialogOpen(false);
    } catch (error) {
      console.error('Error during geocoding or routing:', error);
      toast({
        title: "경로 계산 실패",
        description: "주소를 불러오는 도중 오류가 발생했습니다.",
      })
    }
  }, [startAddress, destinationAddress, mapInstance, routingControl, toast]);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || mapInstance) return;

    const newMapInstance = L.map(mapRef.current, {
      center: [37.5665, 126.9780],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(newMapInstance);

    setMapInstance(newMapInstance);
  }, [mapInstance]);

  useEffect(() => {
    if (isOpen) {
      initializeMap();
    } else if (mapInstance) {
      mapInstance.remove();
      setMapInstance(null);
      setRoutingControl(null);
    }
  }, [isOpen, initializeMap, mapInstance]);

  useEffect(() => {
    if (!mapInstance) return;

    const markers: L.Marker[] = [];

    allLocations.forEach(location => {
      const marker = L.marker([location.lat, location.lng]).addTo(mapInstance);
      marker.bindPopup(`<b>${location.title}</b><br>${location.address}`);
      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => mapInstance.removeLayer(marker));
    };
  }, [mapInstance, allLocations]);

  useEffect(() => {
    if (!mapInstance) return;

    if (selectedLocation) {
      mapInstance.flyTo([selectedLocation.lat, selectedLocation.lng], 15);
    }

    return () => {
    };
  }, [mapInstance, selectedLocation]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[825px] h-[700px]">
        <DialogHeader>
          <DialogTitle>피어맵</DialogTitle>
          <DialogDescription>
            피어몰의 위치를 확인하고, 길찾기를 할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full">
          <div className="w-2/3">
            <div ref={mapRef} className="h-[600px]" />
          </div>

          <div className="w-1/3 p-4 flex flex-col">
            <Button onClick={() => setIsSearchDialogOpen(true)} className="mb-2">
              주소로 검색
            </Button>
            <Button onClick={() => setIsCategoryDialogOpen(true)} className="mb-2">
              카테고리로 검색
            </Button>
            <Button onClick={() => setIsRadiusDialogOpen(true)} className="mb-2">
              반경으로 검색
            </Button>
            <Button onClick={() => setIsRouteDialogOpen(true)} className="mb-2">
              길찾기
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={onClose}>닫기</Button>
        </DialogFooter>
      </DialogContent>

      {/* 주소 검색 Dialog */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>주소 검색</DialogTitle>
            <DialogDescription>
              원하는 주소를 검색하여 지도를 이동합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                주소
              </Label>
              <Input id="address" value={addressSearchQuery} onChange={(e) => setAddressSearchQuery(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddressSearch} disabled={isAddressSearchLoading}>
              {isAddressSearchLoading ? "검색 중..." : "검색"}
            </Button>
          </DialogFooter>
          {!isAddressSearchResultValid && (
            <p className="text-red-500 mt-2">검색 결과가 없습니다. 다른 주소를 입력해주세요.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* 카테고리 선택 Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>카테고리 선택</DialogTitle>
            <DialogDescription>
              원하는 카테고리를 선택하여 피어몰을 검색합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsCategoryDialogOpen(false)}>
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 반경 검색 Dialog */}
      <Dialog open={isRadiusDialogOpen} onOpenChange={setIsRadiusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>반경 검색</DialogTitle>
            <DialogDescription>
              중심 주소를 기준으로 반경 내의 피어몰을 검색합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                주소
              </Label>
              <Input id="address" value={addressSearchQuery} onChange={(e) => setAddressSearchQuery(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="radius" className="text-right">
                반경 (km)
              </Label>
              <Slider
                id="radius"
                defaultValue={[1]}
                max={10}
                step={1}
                onValueChange={handleRadiusChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddressSearch} disabled={isAddressSearchLoading}>
              {isAddressSearchLoading ? "검색 중..." : "검색"}
            </Button>
          </DialogFooter>
          {!isAddressSearchResultValid && (
            <p className="text-red-500 mt-2">검색 결과가 없습니다. 다른 주소를 입력해주세요.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* 길찾기 Dialog */}
      <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>길찾기</DialogTitle>
            <DialogDescription>
              출발지와 목적지를 입력하여 길찾기를 합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startAddress" className="text-right">
                출발지
              </Label>
              <Input
                type="text"
                id="startAddress"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
                className="col-span-3"
              />
            </div>
            {!isStartAddressValid && (
              <p className="text-red-500 mt-2">출발지를 입력해주세요.</p>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinationAddress" className="text-right">
                목적지
              </Label>
              <Input
                type="text"
                id="destinationAddress"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="col-span-3"
              />
            </div>
            {!isDestinationAddressValid && (
              <p className="text-red-500 mt-2">목적지를 입력해주세요.</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={calculateRoute}>
              길찾기
            </Button>
          </DialogFooter>
          {isRouteCalculated && distance !== null && duration !== null && (
            <div className="mt-4">
              <p>총 거리: {distance.toFixed(2)} km</p>
              <p>총 소요 시간: {duration.toFixed(2)} 분</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default PeermallMap;
