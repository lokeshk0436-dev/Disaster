import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, CheckCircle2 } from 'lucide-react';

interface PhotoVerificationFieldProps {
  onPhotoCaptured: (url: string) => void;
  label?: string;
}

export const PhotoVerificationField: React.FC<PhotoVerificationFieldProps> = ({ 
  onPhotoCaptured, 
  label = "Identity Verification Photo" 
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a production environment, this file would be uploaded to Firebase Storage
      // Here we create a local blob URL for immediate UI feedback.
      const url = URL.createObjectURL(file);
      setPreview(url);
      onPhotoCaptured(url);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-slate-300 font-bold mb-2 flex items-center gap-2">
        <Camera className="w-4 h-4 text-cyan-400" />
        {label} <span className="text-rose-400 text-xs ml-1">(Required for Verification)</span>
      </label>
      
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-cyan-500/50 group"
        >
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-white mb-1">Click to Capture or Upload Photo</p>
          <p className="text-xs text-slate-500 text-center px-4">Facial recognition and secure identity verification relies on clear, well-lit photos.</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            capture="environment" // Hints mobile devices to open the rear camera
            className="hidden" 
          />
        </div>
      ) : (
        <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900 group shadow-lg">
          <img src={preview} alt="Verification" className="w-full h-48 object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-emerald-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md shadow-md">
            <CheckCircle2 className="w-4 h-4" />
            Photo Verified
          </div>
          
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreview(null); onPhotoCaptured(''); }}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md transition-colors"
          >
            Retake
          </button>
        </div>
      )}
    </div>
  );
};
