import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { X, Upload, AlertCircle, CheckCircle, MapPin, User, Phone, Navigation } from 'lucide-react';
import { locationService } from '../../../services/locationService';
import { LocationMapPreview } from '../../common/LocationMapPreview';

export const ReportMissingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { createCase, setSelectedCaseId, setActiveTab } = useAypo();

  const [personName, setPersonName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterRelation, setReporterRelation] = useState('Parent');
  const [reporterContact, setReporterContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const geo = await locationService.getCurrentPosition();
      setLastSeenLocation(geo.locationName);
      setLocationCoords({ lat: geo.lat, lng: geo.lng });
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
      const created = await createCase({
        personName: personName.trim(),
        age: parseInt(age, 10) || 25,
        gender,
        status: 'REPORTED_MISSING',
        verificationStatus: 'PENDING_VERIFICATION',
        lastSeenLocation: lastSeenLocation.trim() || 'Coimbatore Evacuation Zone',
        currentLocation: lastSeenLocation.trim() || 'Coimbatore Evacuation Zone',
        physicalDescription: physicalDescription.trim(),
        reporterName: reporterName.trim() || 'Family Member',
        reporterRelation,
        reporterContact: reporterContact.trim() || '+91 98400 00000',
        photoUrl
      });

      setSelectedCaseId(created.id);
      setActiveTab('track');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B142E] border border-cyan-500/40 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Report Missing Family Member
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Case will be broadcast to all disaster rescue teams, shelters & hospital registries
            </p>
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
          {/* Notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong>Emergency Note:</strong> An official AYPO Case ID will be automatically generated. Works offline in case connectivity drops.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Full Name of Missing Person *</label>
              <input
                type="text"
                required
                placeholder="e.g. Raj Kumar"
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 24"
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
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-bold">Last Known Sighting Landmark & Incident Coordinates *</label>
            </div>
            <div className="relative mb-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Avinashi Road Bus Stand near Anna Statue"
                value={lastSeenLocation}
                onChange={e => setLastSeenLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Visibly Embedded Map with Google Maps Pairing */}
            <LocationMapPreview
              initialLocation={lastSeenLocation || 'Avinashi Road Sector, Coimbatore'}
              initialLat={locationCoords?.lat || 11.0183}
              initialLng={locationCoords?.lng || 76.9743}
              onLocationSelected={(res) => {
                setLastSeenLocation(res.locationName);
                setLocationCoords({ lat: res.lat, lng: res.lng });
              }}
              title="Disaster Zone Map Fix (Paired with Google Maps)"
              subtitle="Visibly verify the missing person's last reported location"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Physical Identifiers (Clothing, scars, tattoos, height, glasses) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Height 5'9, wearing dark navy jacket, blue jeans, faint scar above left eyebrow..."
              value={physicalDescription}
              onChange={e => setPhysicalDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Crucial: Our AI matching system compares these key attributes with field shelter records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Anita Kumar"
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Relationship</label>
              <select
                value={reporterRelation}
                onChange={e => setReporterRelation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Relative">Relative</option>
                <option value="Friend">Friend / Neighbor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Contact Phone</label>
              <input
                type="tel"
                placeholder="+91 98401 22341"
                value={reporterContact}
                onChange={e => setReporterContact(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Photo attachment preview */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Photograph (Optional but highly recommended)</label>
            <div className="flex items-center gap-3">
              <img
                src={photoUrl}
                alt="Upload preview"
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
              <input
                type="text"
                placeholder="Photo URL or file link"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-102"
            >
              {isSubmitting ? 'Submitting Report...' : 'File Official Missing Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
