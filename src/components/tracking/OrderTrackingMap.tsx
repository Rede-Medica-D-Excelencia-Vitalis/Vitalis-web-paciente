import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corrige o ícone padrão do Leaflet para que apareça corretamente
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface OrderTrackingMapProps {
  deliveryPosition: [number, number];
  destination: [number, number];
  height?: number;
}

const MapAutoFit: React.FC<{ bounds: L.LatLngBoundsExpression }> = ({ bounds }) => {
  const map = useMap();
  React.useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [bounds, map]);
  return null;
};

export const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({ deliveryPosition, destination, height }) => {
  const bounds: L.LatLngBoundsExpression = [deliveryPosition, destination];
  return (
    <MapContainer style={{ height: height ?? 300, width: '100%', borderRadius: 12 }} center={deliveryPosition} zoom={15} scrollWheelZoom={false} dragging={false} doubleClickZoom={false} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={deliveryPosition}>
        {/* Popup pode ser adicionado aqui se desejar */}
      </Marker>
      <Marker position={destination}>
        {/* Popup pode ser adicionado aqui se desejar */}
      </Marker>
      <Polyline positions={[deliveryPosition, destination]} color="green" weight={5} />
      <MapAutoFit bounds={bounds} />
    </MapContainer>
  );
};
