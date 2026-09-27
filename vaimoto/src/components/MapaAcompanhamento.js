'use client';

import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const iconeMoto = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function MapaAcompanhamento({ origem, destino, motorista }) {
  const centro = motorista || origem;

  return (
    <MapContainer center={[centro.lat, centro.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[origem.lat, origem.lng]} />
      <Marker position={[destino.lat, destino.lng]} />
      {motorista && (
        <>
          <Marker position={[motorista.lat, motorista.lng]} icon={iconeMoto} />
          <Polyline positions={[[motorista.lat, motorista.lng], [destino.lat, destino.lng]]} color="#d4af37" />
        </>
      )}
    </MapContainer>
  );
}
