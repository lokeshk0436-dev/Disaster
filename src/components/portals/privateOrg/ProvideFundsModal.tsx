import React, { useState } from 'react';
import { X, Banknote, HeartHandshake } from 'lucide-react';
import { useAypo } from '../../../context/AypoContext';

export const ProvideFundsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser } = useAypo();
  const [amount, setAmount] = useState('10000');
  const [purpose, setPurpose] = useState('General Disaster Relief & Medical Supplies');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate transaction delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Close modal after showing success message
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B1530] border border-purple-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Provide Relief Funds</h2>
              <p className="text-xs text-slate-400">Pledge financial support directly to the relief operations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-slate-300">
            As an authorized NGO/Private Organization ({currentUser?.organizationName}), your funds are securely routed to the National Disaster Management Command's primary relief pool.
          </p>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Fund Amount (₹ INR) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                required
                min="100"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white font-mono text-base focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Intended Purpose / Designation *</label>
            <select
              required
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="General Disaster Relief & Medical Supplies">General Disaster Relief & Medical Supplies</option>
              <option value="Food & Clean Water Distribution">Food & Clean Water Distribution</option>
              <option value="Shelter & Temporary Housing Construction">Shelter & Temporary Housing Construction</option>
              <option value="Orphaned Children Care Fund">Orphaned Children Care Fund</option>
            </select>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-xl flex items-start gap-3 mt-4">
            <HeartHandshake className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-purple-200 text-xs">
              Thank you for your generous pledge. An official receipt will be generated and routed to your organization's registered email address for tax exemption purposes under 80G.
            </p>
          </div>

          {submitted ? (
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/40 font-bold text-center mt-4">
              ✓ Transaction Successful! Thank you for your contribution.
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black shadow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>Authorize Payment</>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
