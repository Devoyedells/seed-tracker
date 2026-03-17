import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Package } from 'lucide-react';

// Fix default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom green marker for seeds
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const regionCoordinates = {
  'Eastern Province': [8.2, -10.8],
  'Northern Province': [9.0, -12.0],
  'North West Province': [9.0, -12.8],
  'Southern Province': [7.8, -11.8],
  'Western Area': [8.485, -13.23]
};

function MapCenterController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 9);
    }
  }, [center, map]);
  
  return null;
}

export const SeedMap = ({ seeds = [], selectedRegion = null }) => {
  const [center, setCenter] = useState([8.4606, -11.7799]); // Sierra Leone center
  
  useEffect(() => {
    if (selectedRegion && regionCoordinates[selectedRegion]) {
      setCenter(regionCoordinates[selectedRegion]);
    } else {
      setCenter([8.4606, -11.7799]);
    }
  }, [selectedRegion]);

  // Create markers with proper coordinates
  const markers = seeds
    .filter(seed => seed.latitude && seed.longitude)
    .map(seed => ({
      position: [seed.latitude, seed.longitude],
      seed: seed
    }));

  // If seeds don't have coordinates, use region coordinates
  const regionMarkers = seeds
    .filter(seed => !seed.latitude && seed.region && regionCoordinates[seed.region])
    .reduce((acc, seed) => {
      const regionKey = seed.region;
      if (!acc[regionKey]) {
        acc[regionKey] = {
          position: regionCoordinates[regionKey],
          seeds: []
        };
      }
      acc[regionKey].seeds.push(seed);
      return acc;
    }, {});

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200" data-testid="seed-map">
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapCenterController center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Markers with coordinates */}
        {markers.map((marker, index) => (
          <Marker key={`seed-${index}`} position={marker.position} icon={greenIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{marker.seed.name}</h3>
                <p className="text-sm text-gray-600">{marker.seed.variety}</p>
                <p className="text-sm text-gray-700 mt-2">{marker.seed.distributor}</p>
                <p className="text-sm text-sierra-green font-semibold mt-1">
                  Stock: {marker.seed.stock_quantity} {marker.seed.unit}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Region markers for seeds without specific coordinates */}
        {Object.entries(regionMarkers).map(([region, data]) => (
          <Marker key={`region-${region}`} position={data.position} icon={greenIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{region}</h3>
                <p className="text-sm text-gray-600 mb-2">{data.seeds.length} seed varieties</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {data.seeds.slice(0, 5).map((seed, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-medium">{seed.name}</span> - {seed.stock_quantity} {seed.unit}
                    </div>
                  ))}
                  {data.seeds.length > 5 && (
                    <p className="text-xs text-gray-500 mt-1">+{data.seeds.length - 5} more</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
