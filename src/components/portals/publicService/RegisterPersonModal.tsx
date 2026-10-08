import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { PhotoVerificationField } from '../../common/PhotoVerificationField';
import { CaseStatus, TriageLevel } from '../../../types';
import { X, Ambulance, AlertCircle, HeartPulse, Building2, MapPin, Shield, Navigation } from 'lucide-react';
import { locationService } from '../../../services/locationService';
import { LocationMapPreview } from '../../common/LocationMapPreview';

export const RegisterPersonModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { createCase, connectivity } = useAypo();

  const [personName, setPersonName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Unknown'>('Male');
  const [status, setStatus] = useState<CaseStatus>('IN_SHELTER');
  const [triageLevel, setTriageLevel] = useState<TriageLevel>('GREEN');
  const [currentLocation, setCurrentLocation] = useState('Relief Centre 03');
  const [isLocating, setIsLocating] = useState(false);
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const geo = await locationService.getCurrentPosition();
      setCurrentLocation(geo.locationName);
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
        age: parseInt(age, 10) || 25,
        gender,
        status,
        verificationStatus: 'PENDING_VERIFICATION',
        triageLevel,
        currentLocation: currentLocation.trim(),
        lastSeenLocation: currentLocation.trim(),
        physicalDescription: physicalDescription.trim(),
        medicalNotes: medicalNotes.trim(),
        photoUrl
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B1530] border border-cyan-500/40 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Ambulance className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Public Service Patient / Sheltee Intake</h2>
              <p className="text-xs text-slate-400">
                Official registration for rescued individuals, hospital patients, or shelter evacuees
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
          {connectivity === 'OFFLINE' && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <strong>Offline Mode Active:</strong> Record will be queued in local IndexedDB and synced upon uplink.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Person Name / Descriptor *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajkumar or Unidentified Riverbank Rescuee"
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Approx. Age</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>

            {/* Photo Verification Upload */}
            <div className="mt-4 mb-2">
              <PhotoVerificationField 
                onPhotoCaptured={(url) => setPhotoUrl(url)} 
                label="Official Patient / Sheltee Photo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Registration Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as CaseStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="IN_SHELTER">IN SHELTER (Camp / Stadium)</option>
                <option value="HOSPITALIZED">HOSPITALIZED (Emergency Ward)</option>
                <option value="RESCUED">RESCUED (En Route to Camp)</option>
                <option value="TRANSFERRED">TRANSFERRED (Relocation)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Medical Triage Tag</label>
              <select
                value={triageLevel}
                onChange={e => setTriageLevel(e.target.value as TriageLevel)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-bold"
              >
                <option value="GREEN" className="text-emerald-400">GREEN — Minor / Stable</option>
                <option value="YELLOW" className="text-amber-400">YELLOW — Urgent / Non-Life Threatening</option>
                <option value="RED" className="text-rose-400">RED — Critical / Immediate Care</option>
                <option value="BLACK" className="text-slate-400">BLACK — Deceased / Expectant</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-bold">Current Facility / Relief Shelter *</label>
            </div>
            <div className="relative mb-2.5">
              <Building2 className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Relief Centre 03 (Bed #142) or Coimbatore General Ward 4B"
                value={currentLocation}
                onChange={e => setCurrentLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Visibly Embedded Map with Google Maps Pairing */}
            <LocationMapPreview
              initialLocation={currentLocation || 'Relief Centre 03, Coimbatore'}
              initialLat={11.0065}
              initialLng={76.9664}
              onLocationSelected={(res) => {
                setCurrentLocation(res.locationName);
              }}
              title="Admitting Facility GIS Position (Paired with Google Maps)"
              subtitle="Visibly record the physical shelter/hospital intake coordinates"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Physical Features & Visual Identifiers *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Faint scar above left eyebrow, dark jacket, responsive..."
              value={physicalDescription}
              onChange={e => setPhysicalDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5 text-cyan-300">
              <HeartPulse className="w-3.5 h-3.5" /> Medical Chart & Triage Notes (Confidential)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. First aid administered, tetanus shot, mild hypothermia resolved, IV fluids..."
              value={medicalNotes}
              onChange={e => setMedicalNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Protected by Data Isolation: Medical notes are strictly hidden from public and family views.
            </p>
          </div>

          {/* Submit Buttons */}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-102"
            >
              {isSubmitting ? 'Registering Person...' : 'Register Official Intake'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
