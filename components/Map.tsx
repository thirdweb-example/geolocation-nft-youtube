import React, { useEffect, useState } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useContract, useNFTs } from '@thirdweb-dev/react';
import { NFT_CONTRACT_ADDRESS } from '../constants/constants';
import { Coordinates } from '../utils/types/types';
import NFTMarker from './NFTMarker';

const userIcon = new L.Icon({
    iconUrl: '/user-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

type MapEventHandlerProps = {
    position: Coordinates;
};
  
const MapEventHandler: React.FC<MapEventHandlerProps> = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position.lat !== 0 && position.lng !== 0) {
            console.log("Moving map to: ", position);
            map.flyTo([position.lat, position.lng], map.getZoom());
        }
    }, [position, map]);

    return null;
};

const Map = () => {
    const [position, setPosition] = useState<Coordinates>({lat: 51.505, lng: -0.09});
    let watchId: number;
    
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (pos) => {
                    console.log("Location fetched successfully: ", pos);
                    setPosition({lat: pos.coords.latitude, lng: pos.coords.longitude});
                },
                (err) => {
                    console.error("Error fetching location: ", err.message);
                    alert("Unable to access your location. Please enable location permissions in your browser settings.");
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    useEffect(() => {
        getLocation();    

        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    const { contract } = useContract(NFT_CONTRACT_ADDRESS);
    const { data: nfts } = useNFTs(contract);

    return (
      <MapContainer
          center={[position.lat, position.lng]} 
          zoom={16} 
          style={{ height: '90vh', width: '100%' }}
      >
          <MapEventHandler position={position} />
          <TileLayer
              url={`https://api.mapbox.com/styles/v1/MAPBOX_USERNAME/MAPBOX_STYLE_ID/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAP_TOKEN}`}
              attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
          />
          <Marker position={[position.lat, position.lng]} icon={userIcon}>
              <Circle
                  center={position}
                  radius={160.934}
                  color="blue"
                  fillColor="blue"
                  fillOpacity={0.1}
              />
          </Marker>
          {nfts && nfts.length > 0 && nfts.map((nft) => (
            <NFTMarker
                key={nft.metadata.id}
                nft={nft}
                userPosition={position}
            />
          ))}
      </MapContainer>
    );
};

export default Map;