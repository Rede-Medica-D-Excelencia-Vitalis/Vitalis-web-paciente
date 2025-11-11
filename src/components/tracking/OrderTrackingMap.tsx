import React, { useCallback, useEffect, useRef, useState } from 'react';

type LatLngTuple = [number, number];

type OrderTrackingMapProps = {
  deliveryPosition: LatLngTuple;
  destination: LatLngTuple;
  height?: number;
};

declare global {
  interface Window {
    google?: any;
  }
}

let googleMapsScriptPromise: Promise<any> | null = null;

const loadGoogleMapsApi = (apiKey: string) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window is undefined'));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google);
  }

  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-maps="true"]');

      const handleLoad = () => {
        if (window.google && window.google.maps) {
          resolve(window.google);
        } else {
          reject(new Error('Google Maps SDK carregado, mas indisponível.'));
        }
      };

      if (existingScript) {
        existingScript.addEventListener('load', handleLoad);
        existingScript.addEventListener('error', () => reject(new Error('Erro ao carregar Google Maps.')));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = 'true';
      script.onload = handleLoad;
      script.onerror = () => reject(new Error('Erro ao carregar Google Maps.'));
      document.head.appendChild(script);
    });
  }

  return googleMapsScriptPromise;
};

const createLatLng = (googleMaps: any, [lat, lng]: LatLngTuple) => new googleMaps.maps.LatLng(lat, lng);

export const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({ deliveryPosition, destination, height }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ delivery?: any; destination?: any }>({});
  const polylineRef = useRef<any>(null);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateMap = useCallback((googleMaps: any) => {
    const map = mapRef.current;
    if (!map) return;

    if (markersRef.current.delivery) {
      markersRef.current.delivery.setMap(null);
    }
    if (markersRef.current.destination) {
      markersRef.current.destination.setMap(null);
    }
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const deliveryLatLng = createLatLng(googleMaps, deliveryPosition);
    const destinationLatLng = createLatLng(googleMaps, destination);

    markersRef.current.delivery = new googleMaps.maps.Marker({
      position: deliveryLatLng,
      map,
      title: 'Motoboy',
      icon: {
        path: googleMaps.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#2563eb',
        fillOpacity: 1,
        strokeWeight: 3,
        strokeColor: '#ffffff'
      }
    });

    markersRef.current.destination = new googleMaps.maps.Marker({
      position: destinationLatLng,
      map,
      title: 'Destino',
      icon: {
        path: googleMaps.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 4,
        fillColor: '#facc15',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#1f2937'
      }
    });

    polylineRef.current = new googleMaps.maps.Polyline({
      path: [deliveryLatLng, destinationLatLng],
      map,
      strokeColor: '#22c55e',
      strokeOpacity: 0.9,
      strokeWeight: 5
    });

    const bounds = new googleMaps.maps.LatLngBounds();
    bounds.extend(deliveryLatLng);
    bounds.extend(destinationLatLng);
    map.fitBounds(bounds, { padding: 60 });
  }, [deliveryPosition, destination]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setLoadError('Chave de API do Google Maps não configurada.');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setLoadError(null);

    loadGoogleMapsApi(apiKey)
      .then((googleMaps) => {
        if (cancelled || !containerRef.current) return;

        if (!mapRef.current) {
          mapRef.current = new googleMaps.maps.Map(containerRef.current, {
            center: { lat: deliveryPosition[0], lng: deliveryPosition[1] },
            zoom: 14,
            disableDefaultUI: true,
            clickableIcons: false,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
              { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#1f2937' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] }
            ]
          });
        }

        updateMap(googleMaps);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar Google Maps', error);
        if (!cancelled) {
          setLoadError('Não foi possível carregar o mapa no momento.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [deliveryPosition, destination, updateMap]);

  useEffect(() => {
    return () => {
      if (markersRef.current.delivery) {
        markersRef.current.delivery.setMap(null);
      }
      if (markersRef.current.destination) {
        markersRef.current.destination.setMap(null);
      }
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      markersRef.current = {};
      polylineRef.current = null;
    };
  }, []);

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
        {loadError}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl z-10">
          <span className="text-sm font-medium text-blue-700">Carregando mapa...</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full rounded-xl border border-blue-100 shadow-md"
        style={{ height: height ?? 300 }}
      />
    </div>
  );
};
