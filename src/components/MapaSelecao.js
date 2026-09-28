'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function Cliques({ onSelecionar }) {
  useMapEvents({
    click(e) {
      onSelecionar({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapaSelecao({ origem, destino, onSelecionar }) {
  const centro = origem || { lat: -9.4014, lng: -38.2179 }; // Paulo Afonso - BA

  return (
    <MapContainer center={[centro.lat, centro.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Cliques onSelecionar={onSelecionar} />
      {origem && <Marker position={[origem.lat, origem.lng]} />}
      {destino && <Marker position={[destino.lat, destino.lng]} />}
    </MapContainer>
  );
}
