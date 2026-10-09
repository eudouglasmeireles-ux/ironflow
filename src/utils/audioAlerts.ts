/**
 * Generates acoustic gym beeps and speech alerts using Web Audio API and SpeechSynthesis
 */
class SoundService {
  private ctx: AudioContext | null = null;
  private isUnlocked = false;

  public unlockAudio() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isUnlocked = true;
    } catch {
      // Audio context unlock error handled silently
    }
  }

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Warning tick for countdown (e.g., at 3s, 2s, 1s)
   */
  public playCountdownPip(pitch = 700, duration = 0.1) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay fallback
    }
  }

  /**
   * High-impact sound when rest is complete: 3 rapid ascending tones followed by a triumphant chime
   */
  public playRestCompleteChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const tones = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6 triumphant chord
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.12;
        const dur = idx === tones.length - 1 ? 0.6 : 0.15;

        osc.type = idx === tones.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // Audio autoplay fallback
    }

    // Also pronounce speech in Portuguese if SpeechSynthesis is available
    this.speak('Hora da próxima série!');
  }

  /**
   * Speech synthesizer announcement in Brazilian Portuguese
   */
  public speak(text: string) {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // cancel any pending speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.1; // energetic
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // SpeechSynthesis not supported or disabled
    }
  }

  /**
   * Vibration pattern for rest completion (noticeable double pulse)
   */
  public vibrate(pattern: number[] = [300, 150, 400]) {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Vibration not permitted
    }
  }
}

export const soundService = new SoundService();
