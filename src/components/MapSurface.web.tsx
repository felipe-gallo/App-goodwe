import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Charger } from '../types';

type Props = {
  chargers: Charger[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

const statusColor = (status: Charger['status']) =>
  status === 'available'
    ? '#14824a'
    : status === 'in_use'
      ? '#ad6500'
      : '#707a84';

export default function MapSurface({ chargers, selectedId, onSelect }: Props) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!elementRef.current || mapRef.current) return;

    const map = L.map(elementRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([-23.572, -46.6225], 14);
    const markers = markersRef.current;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    chargers.forEach(charger => {
      const color = statusColor(charger.status);
      const icon = L.divIcon({
        className: '',
        html: `<div aria-label="${charger.name}" style="width:42px;height:42px;border-radius:21px;background:${color};border:4px solid #fff;box-shadow:0 6px 18px #0005;color:#fff;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900">⚡</div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });
      const marker = L.marker([charger.latitude, charger.longitude], {
        icon,
        title: charger.name,
        alt: `Abrir painel de ${charger.name}`,
      }).addTo(map);
      marker.on('click', () => onSelectRef.current(charger.id));
      markers.set(charger.id, marker);
    });

    mapRef.current = map;
    window.setTimeout(() => map.invalidateSize(), 0);
    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, [chargers]);

  useEffect(() => {
    if (!selectedId) return;
    const charger = chargers.find(item => item.id === selectedId);
    if (charger) {
      mapRef.current?.flyTo([charger.latitude, charger.longitude], 15, {
        duration: 0.45,
      });
    }
  }, [chargers, selectedId]);

  return React.createElement('div', {
    ref: elementRef,
    role: 'application',
    'aria-label': 'Mapa dos eletropostos EMPS',
    style: {
      width: '100%',
      height: '100%',
      minHeight: 360,
      background: '#dce3e7',
    },
  });
}
