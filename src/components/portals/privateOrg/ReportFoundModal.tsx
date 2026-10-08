import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { X, Building2, MapPin, CheckCircle, FileText, Camera, Navigation } from 'lucide-react';
import { locationService } from '../../../services/locationService';
import { LocationMapPreview } from '../../common/LocationMapPreview';

export const ReportFoundModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { createCase, currentUser } = useAypo();

  const [personName, setPersonName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Unknown'>('Male');
  const [foundLocation, setFoundLocation] = useState('');
  const [shelterLocation, setShelterLocation] = useState('Camp Victoria Refuge');
  const [isLocating, setIsLocating] = useState(false);
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const geo = await locationService.getCurrentPosition();
      setFoundLocation(geo.locationName);
    } finally {
      setIsLocating(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) return;

    setIsSubmitting(true);
    try {
      await createCase({
        personName: personName.trim(),
        age: parseInt(age, 10) || 30,
        gender,
        status: 'IN_SHELTER',
        verificationStatus: 'PENDING_VERIFICATION',
        currentLocation: shelterLocation.trim(),
        lastSeenLocation: foundLocation.trim() || shelterLocation.trim(),
        physicalDescription: physicalDescription.trim(),
        organizationName: currentUser.organizationName,
        photoUrl
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B1530] border border-amber-500/40 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">NGO / Volunteer Found Person Intake</h2>
              <p className="text-xs text-slate-400">
                Log individuals located or sheltered by Red Cross, NGOs, or volunteer teams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Name / Identifier *</label>
              <input
                type="text"
                required
                placeholder="e.g. Meenammal or Found at Bus Stand"
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Estimated Age</label>
                <input
                  type="number"
                  placeholder="e.g. 65"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-bold">Exact Sighting / Rescue Coordinates *</label>
            </div>
            <div className="relative mb-2.5">
              <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Sheltered under Peelamedu bus awning"
                value={foundLocation}
                onChange={e => setFoundLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Visibly Embedded Map with Google Maps Pairing */}
            <LocationMapPreview
              initialLocation={foundLocation || 'Peelamedu Sector, Coimbatore'}
              initialLat={11.0253}
              initialLng={77.0028}
              onLocationSelected={(res) => {
                setFoundLocation(res.locationName);
              }}
              title="Field Sighting GIS Position (Paired with Google Maps)"
              subtitle="Visibly record the physical recovery or sighting coordinates"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Current Shelter / Hub *</label>
            <input
              type="text"
              required
              placeholder="e.g. Camp Victoria Refuge"
              value={shelterLocation}
              onChange={e => setShelterLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Physical Appearance & Clues *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Green traditional saree with gold border, disoriented, silver hair, has walking stick..."
              value={physicalDescription}
              onChange={e => setPhysicalDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Volunteer Sighting Photo</label>
            <input
              type="text"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Register Found Person'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
