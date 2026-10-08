import React, { useState } from 'react';
import { X, AlertTriangle, MapPin, Radio } from 'lucide-react';
import { useAypo } from '../../../context/AypoContext';

export const BroadcastAlertModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { storageService, setNotifications } = useAypo() as any;
  const [alertType, setAlertType] = useState('EVACUATION_ORDER');
  const [location, setLocation] = useState('RS Puram, Coimbatore');
  const [message, setMessage] = useState('Flash flood warning. Evacuate to higher ground immediately.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Add notification to system
      storageService.addNotification({
        caseId: 'SYSTEM',
        targetRole: 'ALL',
        title: `EMERGENCY ALERT: ${alertType.replace('_', ' ')}`,
        message: `${message} Location: ${location}`,
        type: 'CRITICAL_ALERT',
        channels: ['IN_APP', 'SMS']
      });
      setNotifications(storageService.getNotifications());

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B1530] border border-red-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-red-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Broadcast Disaster Alert</h2>
              <p className="text-xs text-slate-400">Issue an emergency alert to all connected citizens & NGOs</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Alert Classification *</label>
            <select
              required
              value={alertType}
              onChange={e => setAlertType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="EVACUATION_ORDER">Mandatory Evacuate Order</option>
              <option value="FLASH_FLOOD_WARNING">Flash Flood Warning</option>
              <option value="SHELTER_IN_PLACE">Shelter in Place Advisory</option>
              <option value="RELIEF_DISPATCHED">Relief Materials Dispatched</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Impacted Location / Zone *</label>
            <div className="relative flex gap-2">
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. RS Puram, Coimbatore"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Verify on Google Maps"
                className="flex items-center justify-center px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
            <p className="text-slate-500 mt-1">Click the Map pin to verify the exact coordinates in Google Maps before broadcasting.</p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Emergency Broadcast Message *</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-xl flex items-start gap-3 mt-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-xs">
              <strong>WARNING:</strong> This will trigger SMS and in-app notifications to all registered users in the selected sector. False alarms are strictly prohibited.
            </p>
          </div>

          {submitted ? (
            <div className="p-3 bg-red-500 text-white rounded-xl font-bold text-center mt-4">
              ✓ ALERT BROADCASTED ACROSS ALL CHANNELS
            </div>
          ) : (
            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black shadow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Transmitting...</span>
                ) : (
                  <>Broadcast Alert</>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
