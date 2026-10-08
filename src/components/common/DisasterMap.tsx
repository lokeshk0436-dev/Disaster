import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAypo } from '../../context/AypoContext';
import { locationService } from '../../services/locationService';
import { 
  Shield, 
  Home, 
  Activity, 
  MapPin, 
  Filter, 
  Navigation, 
  ExternalLink,
  RefreshCw,
  Compass
} from 'lucide-react';

export const DisasterMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const { visibleCases, shelters, hospitals, setSelectedCaseId, setActiveTab } = useAypo();
  const [filterType, setFilterType] = useState<'ALL' | 'SHELTERS' | 'HOSPITALS' | 'FOUND' | 'MISSING'>('ALL');
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; name: string } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map centered at disaster epicenter (Coimbatore / Nilgiris basin)
      const map = L.map(mapContainerRef.current, {
        center: [11.0168, 76.9558],
        zoom: 12,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark tactical carto basemap
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fly to user GPS position
  const handleFlyToUserLocation = async () => {
    if (!mapInstanceRef.current) return;
    setIsLocating(true);
    try {
      const geo = await locationService.getCurrentPosition();
      setUserCoords({ lat: geo.lat, lng: geo.lng, name: geo.locationName });

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      // Drop visible pulsing user marker
      const userIcon = L.divIcon({
        className: 'user-live-gps-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px;">
            <div style="position: absolute; inset: 0; background: rgba(6, 182, 212, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; inset: 4px; background: #06B6D4; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #FFFFFF; box-shadow: 0 0 15px rgba(6, 182, 212, 0.8);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const userMarker = L.marker([geo.lat, geo.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #0B132B;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #0891B2;">Your Current Position (Live Fix)</div>
          <div style="font-size: 13px; font-weight: 700; margin: 2px 0;">${geo.locationName}</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">GPS: ${geo.lat}, ${geo.lng} (±${geo.accuracyMeters}m)</div>
          <a href="${geo.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #0891B2; color: white; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
            Open in Google Maps ↗
          </a>
        </div>
      `);

      userMarker.addTo(mapInstanceRef.current);
      userMarkerRef.current = userMarker;
      mapInstanceRef.current.flyTo([geo.lat, geo.lng], 14, { duration: 1.2 });
      userMarker.openPopup();
    } finally {
      setIsLocating(false);
    }
  };

  // Update Markers based on data and filter
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Shelters
    if (filterType === 'ALL' || filterType === 'SHELTERS') {
      shelters.forEach(shelter => {
        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="background: #0077B6; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(0,180,216,0.6); border: 2px solid #FFFFFF;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const gUrl = locationService.getGoogleMapsUrl(shelter.lat, shelter.lng);
        const marker = L.marker([shelter.lat, shelter.lng], { icon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; color: #0B132B; max-width: 240px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #0077B6;">Active Shelter Hub</div>
            <div style="font-size: 14px; font-weight: 800; margin: 2px 0;">${shelter.name}</div>
            <div style="font-size: 12px; color: #4B5563; margin-bottom: 6px;">${shelter.location}</div>
            <div style="background: #F3F4F6; padding: 6px; border-radius: 6px; font-size: 11px; margin-bottom: 8px;">
              <div><strong>Capacity:</strong> ${shelter.occupancy} / ${shelter.capacity}</div>
              <div><strong>Water & Food:</strong> ${shelter.waterStatus} • ${shelter.foodStatus}</div>
              <div><strong>Medical Staff:</strong> ${shelter.medicalTeamPresent ? 'Present' : 'En route'}</div>
            </div>
            <a href="${gUrl}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #0077B6; color: white; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
              Open in Google Maps ↗
            </a>
          </div>
        `);
        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Hospitals
    if (filterType === 'ALL' || filterType === 'HOSPITALS') {
      hospitals.forEach(hosp => {
        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="background: #E63946; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(230,57,70,0.6); border: 2px solid #FFFFFF;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const gUrl = locationService.getGoogleMapsUrl(hosp.lat, hosp.lng);
        const marker = L.marker([hosp.lat, hosp.lng], { icon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; color: #0B132B; max-width: 240px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #E63946;">Trauma Centre / Hospital</div>
            <div style="font-size: 14px; font-weight: 800; margin: 2px 0;">${hosp.name}</div>
            <div style="font-size: 12px; color: #4B5563; margin-bottom: 6px;">${hosp.location}</div>
            <div style="background: #FEE2E2; padding: 6px; border-radius: 6px; font-size: 11px; color: #991B1B; margin-bottom: 8px;">
              <div><strong>Triage Beds:</strong> ${hosp.triageBedsAvailable} available / ${hosp.triageBedsTotal}</div>
              <div><strong>ICU Capacity:</strong> ${hosp.icuBedsAvailable} beds available</div>
              <div><strong>Surgeons:</strong> ${hosp.traumaSurgeonsOnDuty} on active duty</div>
            </div>
            <a href="${gUrl}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #E63946; color: white; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
              Open in Google Maps ↗
            </a>
          </div>
        `);
        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 3. Cases (Found vs Missing)
    visibleCases.forEach(item => {
      const isMissing = item.status === 'REPORTED_MISSING';
      const isReunited = item.status === 'REUNITED';
      const isFound = !isMissing && !isReunited;

      if (filterType === 'MISSING' && !isMissing) return;
      if (filterType === 'FOUND' && !isFound && !isReunited) return;

      const bgColor = isReunited ? '#2A9D8F' : isFound ? '#06D6A0' : '#FB8500';

      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background: ${bgColor}; color: #0B132B; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${bgColor}; border: 2px solid #FFFFFF; font-weight: bold; font-size: 11px;">
            ${isReunited ? '★' : isFound ? '✓' : '!'}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const gUrl = locationService.getGoogleMapsUrl(item.locationCoordinates.lat, item.locationCoordinates.lng);
      const marker = L.marker([item.locationCoordinates.lat, item.locationCoordinates.lng], { icon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #0B132B; max-width: 240px;">
          <div style="font-size: 10px; font-weight: 800; color: ${bgColor}; text-transform: uppercase;">
            ${item.id} • ${item.status.replace(/_/g, ' ')}
          </div>
          <div style="font-size: 14px; font-weight: 800; margin: 2px 0;">${item.personName}</div>
          <div style="font-size: 11px; color: #4B5563;">Age ${item.age} • ${item.gender}</div>
          <div style="font-size: 12px; margin: 4px 0;"><strong>Location:</strong> ${item.currentLocation}</div>
          <div style="display: flex; gap: 4px; margin-top: 8px;">
            <button id="view-case-${item.id}" style="flex: 1; background: #0077B6; color: white; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: none; cursor: pointer;">
              Inspect Case
            </button>
            <a href="${gUrl}" target="_blank" rel="noopener noreferrer" style="background: #E2E8F0; color: #0F172A; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
              Google Maps ↗
            </a>
          </div>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-case-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedCaseId(item.id);
            setActiveTab('track');
          };
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });

  }, [visibleCases, shelters, hospitals, filterType, setSelectedCaseId, setActiveTab]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
      {/* Map Filter Controls Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 shadow-lg">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filters:
        </span>
        <button
          onClick={() => setFilterType('ALL')}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            filterType === 'ALL'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          All Points
        </button>
        <button
          onClick={() => setFilterType('SHELTERS')}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
            filterType === 'SHELTERS'
              ? 'bg-blue-500 text-white shadow-md font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Home className="w-3 h-3 text-blue-400" /> Shelters ({shelters.length})
        </button>
        <button
          onClick={() => setFilterType('HOSPITALS')}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
            filterType === 'HOSPITALS'
              ? 'bg-rose-500 text-white shadow-md font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3 h-3 text-rose-400" /> Hospitals ({hospitals.length})
        </button>
        <button
          onClick={() => setFilterType('FOUND')}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            filterType === 'FOUND'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Found / Sheltered
        </button>
        <button
          onClick={() => setFilterType('MISSING')}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            filterType === 'MISSING'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Missing Reports
        </button>
      </div>

      {/* Top-Right Real GPS & Google Maps Telemetry Bar */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
        <button
          onClick={handleFlyToUserLocation}
          disabled={isLocating}
          className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all cursor-pointer border border-cyan-400/40 active:scale-95"
          title="Detect live GPS position and pin on tactical map"
        >
          {isLocating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-cyan-200" />
          )}
          <span>{isLocating ? 'Locating...' : '📍 Locate Me'}</span>
        </button>

        <a
          href="https://www.google.com/maps/@11.0168,76.9558,13z"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-white text-slate-200 hover:text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all border border-slate-700 hover:border-white backdrop-blur-md"
          title="Open complete crisis sector in Google Maps"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Google Maps</span>
        </a>
      </div>

      {/* Legend Badge Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-[1000] hidden sm:flex items-center gap-4 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Shelter Hub
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Hospital/Triage
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Found / Rescued
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Missing Report
        </div>
        {userCoords && (
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold border-l border-slate-700 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span> Live Device Fix
          </div>
        )}
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-950" />
    </div>
  );
};
