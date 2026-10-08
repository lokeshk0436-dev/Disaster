import React, { useState } from 'react';
import { locationService, GeoLocationResult } from '../../services/locationService';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Compass, 
  RefreshCw,
  Layers
} from 'lucide-react';

interface LocationMapPreviewProps {
  initialLocation?: string;
  initialLat?: number;
  initialLng?: number;
  onLocationSelected?: (result: GeoLocationResult) => void;
  title?: string;
  subtitle?: string;
}

export const LocationMapPreview: React.FC<LocationMapPreviewProps> = ({
  initialLocation,
  initialLat = 11.0168,
  initialLng = 76.9558,
  onLocationSelected,
  title = 'Real-Time Location & GIS Verification',
  subtitle = 'Detect your live browser coordinates and verify visibly on the map'
}) => {
  const [geoData, setGeoData] = useState<GeoLocationResult | null>(() => {
    if (initialLocation && initialLat && initialLng) {
      return {
        lat: initialLat,
        lng: initialLng,
        locationName: initialLocation,
        accuracyMeters: 10,
        googleMapsUrl: locationService.getGoogleMapsUrl(initialLat, initialLng),
        osmEmbedUrl: locationService.getOSMEmbedUrl(initialLat, initialLng),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDetectLocation = async () => {
    setIsLoading(true);
    try {
      const result = await locationService.getCurrentPosition();
      setGeoData(result);
      if (onLocationSelected) {
        onLocationSelected(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCoords = () => {
    if (!geoData) return;
    const text = `${geoData.lat}, ${geoData.lng} (${geoData.locationName})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLat = geoData?.lat || initialLat;
  const currentLng = geoData?.lng || initialLng;
  const currentGoogleUrl = geoData?.googleMapsUrl || locationService.getGoogleMapsUrl(currentLat, currentLng);
  const currentEmbedUrl = geoData?.osmEmbedUrl || locationService.getOSMEmbedUrl(currentLat, currentLng);

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-950/90 overflow-hidden shadow-xl text-xs">
      {/* Header Bar */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
        <div>
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>{title}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Acquiring Fix...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5 text-cyan-200" />
              <span>📍 Use My Current Location</span>
            </>
          )}
        </button>
      </div>

      {/* Visible Map Viewport */}
      <div className="relative w-full h-44 sm:h-52 bg-slate-900 overflow-hidden border-b border-slate-800">
        <iframe
          title="Live Map Preview"
          src={currentEmbedUrl}
          className="w-full h-full border-0 filter contrast-105"
          loading="lazy"
        />

        {/* Floating Google Maps Pairing Pill on top of Map */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-2 z-10">
          <a
            href={currentGoogleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-slate-950/90 hover:bg-white text-slate-200 hover:text-slate-950 font-bold text-[11px] border border-slate-700/80 hover:border-white shadow-lg transition-all flex items-center gap-1.5 backdrop-blur-md"
            title="Open exact coordinates in Google Maps"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Target Reticle in Center */}
        <div className="absolute bottom-2 left-2 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
          GIS Fix: {currentLat.toFixed(4)}°N, {currentLng.toFixed(4)}°E
        </div>
      </div>

      {/* Telemetry Detail & Coordinates Footer */}
      <div className="p-3 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="min-w-0">
            <div className="font-semibold text-white truncate text-xs">
              {geoData ? geoData.locationName : (initialLocation || 'Coimbatore Incident Operations Sector 4')}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="font-mono text-emerald-400">
                {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
              </span>
              {geoData?.accuracyMeters && (
                <span>• Accuracy ±{geoData.accuracyMeters}m</span>
              )}
              {geoData?.timestamp && (
                <span>• Fix acquired {geoData.timestamp}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleCopyCoords}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            title="Copy Coordinates to Clipboard"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <a
            href={locationService.getGoogleDirectionsUrl(currentLat, currentLng)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            title="Get driving/walking directions in Google Maps"
          >
            <span>Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
