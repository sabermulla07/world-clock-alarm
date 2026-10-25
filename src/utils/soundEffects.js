// Web Audio API Synthesizer for high-fidelity alarms and clock ticks without external dependencies

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play subtle mechanical clock tick
  playTick(volume = 0.15) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch (e) {
      // Audio playback might be restricted before user interaction
    }
  }

  // Play synthesized alarm by type
  playAlarm(soundType = 'electronic', volume = 0.5) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (soundType === 'electronic') {
        // Double electronic beep
        [0, 0.15, 0.35, 0.5].forEach((delay, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(idx % 2 === 0 ? 880 : 1046.5, now + delay);

          gain.gain.setValueAtTime(0.3, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + delay);
          osc.stop(now + delay + 0.12);
        });
      } else if (soundType === 'marimba') {
        // Soothing warm harmonic chords
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);

          gain.gain.setValueAtTime(0.4, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.85);
        });
      } else if (soundType === 'cosmic') {
        // Pulsing space sci-fi sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.75);
      } else if (soundType === 'bell') {
        // Resonant acoustic bell
        const freqs = [660, 1320, 1980];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const initialGain = 0.4 / (i + 1);
          gain.gain.setValueAtTime(initialGain, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 1.25);
        });
      } else {
        // Classic digital alarm
        [0, 0.2, 0.4].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(987.77, now + delay); // B5

          gain.gain.setValueAtTime(0.4, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + delay);
          osc.stop(now + delay + 0.13);
        });
      }
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  }
}

export const soundSynth = new SoundSynthesizer();
