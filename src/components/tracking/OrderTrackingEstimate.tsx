import React from 'react';

interface OrderTrackingEstimateProps {
  deliveryPosition: [number, number];
  destination: [number, number];
}

function haversineDistance([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in km
}

export const OrderTrackingEstimate: React.FC<OrderTrackingEstimateProps> = ({ deliveryPosition, destination }) => {
  const distance = haversineDistance(deliveryPosition, destination); // km
  const averageSpeed = 35; // km/h (simulação)
  const etaMinutes = Math.round((distance / averageSpeed) * 60 + 8); // tempo estimado com um buffer

  return (
    <div className="text-center my-2">
      <span className="text-green-700 font-semibold">Previsão de entrega: {etaMinutes} minutos</span>
      <div className="text-xs text-gray-500">Distância até o destino: {distance.toFixed(2)} km</div>
    </div>
  );
};
