import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { locationService } from '../../../services/locationService';
import { 
  Home, 
  Phone, 
  MapPin, 
  Users, 
  Droplets, 
  Utensils, 
  HeartPulse, 
  ShieldCheck,
  ExternalLink,
  Navigation
} from 'lucide-react';

export const AssistanceCentresView: React.FC = () => {
  const { shelters, hospitals } = useAypo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-cyan-400" /> Authorized Assistance & Relief Centres
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Official government shelters and hospital trauma facilities providing medical care, food, and safe shelter. Every facility is mapped and paired with live Google Maps routes.
          </p>
        </div>
        <a
          href="https://www.google.com/maps/search/emergency+shelters+and+hospitals+coimbatore"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>View All Facilities on Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Shelters Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Home className="w-4 h-4" /> Active Humanitarian Shelters ({shelters.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shelters.map(s => {
            const googleMapsUrl = locationService.getGoogleMapsUrl(s.lat, s.lng);
            const googleDirectionsUrl = locationService.getGoogleDirectionsUrl(s.lat, s.lng);

            return (
              <div
                key={s.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      {s.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {s.lat.toFixed(4)}°N, {s.lng.toFixed(4)}°E
                    </span>
                  </div>
                  
                  <h4 className="text-base font-bold text-white mt-2">{s.name}</h4>
                  
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{s.location}</span>
                  </div>
                </div>

                {/* Occupancy Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current Occupancy</span>
                    <span className="font-bold text-slate-200">
                      {s.occupancy} / {s.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (s.occupancy / s.capacity) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Supplies pill badges */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-bold">
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-cyan-300">
                    <Droplets className="w-3.5 h-3.5 mx-auto mb-0.5 text-cyan-400" />
                    <span>{s.waterStatus}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-emerald-300">
                    <Utensils className="w-3.5 h-3.5 mx-auto mb-0.5 text-emerald-400" />
                    <span>{s.foodStatus}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-purple-300">
                    <HeartPulse className="w-3.5 h-3.5 mx-auto mb-0.5 text-purple-400" />
                    <span>{s.medicalTeamPresent ? 'Med Staff' : 'First Aid'}</span>
                  </div>
                </div>

                {/* Google Maps Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-center text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </a>
                  <a
                    href={googleDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-center text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Directions</span>
                  </a>
                </div>

                <div className="border-t border-slate-800 pt-2 text-xs flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3 text-slate-500" /> {s.contact}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> NDMC Certified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hospitals Section */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
          <HeartPulse className="w-4 h-4" /> Trauma Centres & Emergency Hospitals ({hospitals.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map(h => {
            const googleMapsUrl = locationService.getGoogleMapsUrl(h.lat, h.lng);
            const googleDirectionsUrl = locationService.getGoogleDirectionsUrl(h.lat, h.lng);

            return (
              <div
                key={h.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-rose-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                        {h.id}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{h.name}</h4>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span>{h.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">{h.triageBedsAvailable} Beds Open</div>
                      <div className="text-[10px] text-slate-500">{h.icuBedsAvailable} ICU Available</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500">Blood Bank: </span>
                    <strong className="text-rose-400">{h.bloodStockStatus}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Surgeons: </span>
                    <strong className="text-slate-200">{h.traumaSurgeonsOnDuty} on duty</strong>
                  </div>
                </div>

                {/* Google Maps Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-center text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3 text-rose-400" />
                  </a>
                  <a
                    href={googleDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-center text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Emergency Route</span>
                  </a>
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
                  <span>Emergency Desk: <strong className="text-slate-300">{h.contact}</strong></span>
                  <span className="text-rose-400 text-[10px] font-bold">24/7 Trauma Service</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
