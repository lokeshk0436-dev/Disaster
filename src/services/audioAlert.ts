/**
 * Web Audio API Emergency Alert Sound Generator
 * Synthesizes crisp, professional emergency sounds natively without external assets.
 */

class SoundService {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  /**
   * Pleasant ascending 3-tone chime for verified match & notification
   */
  playVerificationChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.35);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.36);
      });
    } catch (e) {
      // Graceful fallback for autoplay restrictions
    }
  }

  /**
   * Celebratory triumph chime for final family reunification
   */
  playReunificationFanfare() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const chords = [
        [523.25, 659.25, 783.99],       // C Major
        [587.33, 739.99, 880.00],       // D Major
        [659.25, 830.61, 987.77],       // E Major
        [783.99, 987.77, 1174.66, 1567.98] // Grand G Major octave
      ];

      chords.forEach((chord, step) => {
        chord.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + step * 0.2);
          
          gain.gain.setValueAtTime(0.001, now + step * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.15, now + step * 0.2 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + step * 0.2 + 0.5);
          
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          
          osc.start(now + step * 0.2);
          osc.stop(now + step * 0.2 + 0.55);
        });
      });
    } catch (e) {}
  }

  /**
   * Tactical emergency ping (when switching offline/online)
   */
  playTacticalPing() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }
}

export const audioAlert = new SoundService();
