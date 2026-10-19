/**
 * Web Audio API synthesizer for retro arcade sound effects, realistic continuous engine roar & synthwave soundtrack.
 * Fully self-contained without external audio dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public sfxEnabled: boolean = true;
  public musicEnabled: boolean = true;
  private musicInterval: number | null = null;
  private musicStep: number = 0;

  // Continuous Engine Synthesizer Nodes
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private isEngineRunning: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startEngine(speedRatio: number = 0.5) {
    if (!this.sfxEnabled || this.isEngineRunning) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.engineOsc1 = this.ctx.createOscillator();
      this.engineOsc2 = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineFilter = this.ctx.createBiquadFilter();

      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'triangle';

      const baseFreq = 55 + speedRatio * 90;
      this.engineOsc1.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      this.engineOsc2.frequency.setValueAtTime(baseFreq * 1.5, this.ctx.currentTime);

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(400 + speedRatio * 800, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc1.start();
      this.engineOsc2.start();
      this.isEngineRunning = true;
    } catch {}
  }

  updateEngine(speedRatio: number) {
    if (!this.isEngineRunning || !this.ctx || !this.engineOsc1 || !this.engineOsc2 || !this.engineFilter) return;
    try {
      const now = this.ctx.currentTime;
      // Gear shift illusion: frequency cycles across 5 gears
      const gear = Math.min(5, Math.floor(speedRatio * 5) + 1);
      const gearSubRatio = (speedRatio * 5) % 1;
      const targetFreq = 50 + gearSubRatio * 110 + (gear - 1) * 12;

      this.engineOsc1.frequency.setTargetAtTime(targetFreq, now, 0.08);
      this.engineOsc2.frequency.setTargetAtTime(targetFreq * 1.5, now, 0.08);
      this.engineFilter.frequency.setTargetAtTime(350 + speedRatio * 950, now, 0.08);
    } catch {}
  }

  stopEngine() {
    if (!this.isEngineRunning) return;
    try {
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
      setTimeout(() => {
        try {
          this.engineOsc1?.stop();
          this.engineOsc2?.stop();
          this.engineOsc1?.disconnect();
          this.engineOsc2?.disconnect();
        } catch {}
        this.engineOsc1 = null;
        this.engineOsc2 = null;
        this.isEngineRunning = false;
      }, 80);
    } catch {
      this.isEngineRunning = false;
    }
  }

  playScreech() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(350, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  playClick() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  playCoin() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(987.77, now);
      osc1.frequency.setValueAtTime(1318.51, now + 0.07);

      osc2.frequency.setValueAtTime(1975.53, now);
      osc2.frequency.setValueAtTime(2637.02, now + 0.07);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    } catch {}
  }

  playNearMiss() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  playNitro() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(2600, now + 0.45);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {}
  }

  playShieldPickup() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  playShieldBreak() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  playHonk() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(420, now);
      osc2.frequency.setValueAtTime(520, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.2);
      osc2.stop(now + 0.2);
    } catch {}
  }

  playCrash() {
    this.stopEngine();
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.6);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {}
  }

  playVictory() {
    this.stopEngine();
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const time = this.ctx!.currentTime + idx * 0.12;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(time);
        osc.stop(time + 0.3);
      });
    } catch {}
  }

  startMusic() {
    if (!this.musicEnabled || this.musicInterval) return;
    this.initCtx();
    const notes = [130.81, 146.83, 164.81, 196.0, 174.61, 164.81, 146.83, 130.81];
    this.musicStep = 0;
    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[this.musicStep % notes.length], now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);

        this.musicStep++;
      } catch {}
    }, 200);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleSFX(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    if (!this.sfxEnabled) {
      this.stopEngine();
    }
    return this.sfxEnabled;
  }

  toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }
}

export const audio = new SoundEngine();
