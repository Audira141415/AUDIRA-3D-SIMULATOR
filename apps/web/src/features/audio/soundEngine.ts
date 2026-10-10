// Procedural Web Audio Engine for AUDIRA 3D Simulator
// Generates vehicle engine revs, horn harmonics, placement clicks, and crash SFX entirely in browser

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private isMuted: boolean = false;

  // Engine audio nodes
  private engineOscA: OscillatorNode | null = null;
  private engineOscB: OscillatorNode | null = null;
  private engineOscSub: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;
  private engineRunning: boolean = false;

  // Ambience nodes
  private ambienceNodes: AudioNode[] = [];
  private ambienceRunning: boolean = false;

  private initCtx() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.6;

      const compressor = this.ctx.createDynamicsCompressor();
      this.masterGain.connect(compressor);
      compressor.connect(this.ctx.destination);

      // Create white noise buffer for wind/gravel/skid
      this.noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  // Play crisp placement sound effect
  public playPlacement() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Play vehicle dual-tone horn
  public playHorn() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain) return;

    const t = ctx.currentTime;
    const freqs = [380, 480]; // Dual-tone European car horn

    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);

      // Lowpass filter to smooth harshness
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1600;

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.03);
      gain.gain.setValueAtTime(0.2, t + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // Play impact / crash sound effect
  public playCrash() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain || !this.noiseBuffer) return;

    const t = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(t);
    source.stop(t + 0.6);
  }

  // Start continuous engine synthesizer
  public startEngine() {
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain || this.engineRunning) return;

    this.engineOscA = ctx.createOscillator();
    this.engineOscA.type = 'sawtooth';

    this.engineOscB = ctx.createOscillator();
    this.engineOscB.type = 'square';

    this.engineOscSub = ctx.createOscillator();
    this.engineOscSub.type = 'sine';

    this.engineFilter = ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 350;
    this.engineFilter.Q.value = 3;

    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0.08;

    this.engineOscA.connect(this.engineFilter);
    this.engineOscB.connect(this.engineFilter);
    this.engineOscSub.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    const t = ctx.currentTime;
    this.engineOscA.start(t);
    this.engineOscB.start(t);
    this.engineOscSub.start(t);

    this.engineRunning = true;
  }

  // Update engine pitch & volume based on speed
  public updateEngine(speedRatio: number, isAccelerating: boolean) {
    if (!this.engineRunning || !this.ctx) {
      if (speedRatio > 0.01 || isAccelerating) {
        this.startEngine();
      }
      return;
    }

    const t = this.ctx.currentTime;
    const baseFreq = 42 + speedRatio * 90 + (isAccelerating ? 22 : 0);
    const filterFreq = 320 + speedRatio * 800 + (isAccelerating ? 250 : 0);
    const volume = 0.06 + speedRatio * 0.14 + (isAccelerating ? 0.05 : 0);

    if (this.engineOscA) this.engineOscA.frequency.setTargetAtTime(baseFreq, t, 0.08);
    if (this.engineOscB) this.engineOscB.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.08);
    if (this.engineOscSub) this.engineOscSub.frequency.setTargetAtTime(baseFreq * 0.25, t, 0.08);
    if (this.engineFilter) this.engineFilter.frequency.setTargetAtTime(filterFreq, t, 0.1);
    if (this.engineGain) this.engineGain.gain.setTargetAtTime(this.isMuted ? 0 : volume, t, 0.08);
  }

  // Stop engine audio
  public stopEngine() {
    if (!this.engineRunning || !this.ctx) return;
    const t = this.ctx.currentTime;

    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(0, t, 0.1);
    }

    setTimeout(() => {
      try {
        this.engineOscA?.stop();
        this.engineOscB?.stop();
        this.engineOscSub?.stop();
        this.engineOscA?.disconnect();
        this.engineOscB?.disconnect();
        this.engineOscSub?.disconnect();
      } catch {}
      this.engineRunning = false;
    }, 150);
  }

  // Play UI click sound (short, crisp)
  public playUIClick() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.06);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Play deletion sound (destructive crunch)
  public playDelete() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain || !this.noiseBuffer) return;
    const t = ctx.currentTime;

    // Crunchy noise burst
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.2);
    filter.Q.value = 2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(t);
    source.stop(t + 0.25);

    // Descending pitch sweep
    const osc = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);
    g2.gain.setValueAtTime(0.15, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(g2);
    g2.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Play undo sound (reverse ping)
  public playUndo() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain) return;
    const t = ctx.currentTime;
    [660, 440].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.15, t + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.12);
    });
  }

  // Play redo sound (forward chime)
  public playRedo() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain) return;
    const t = ctx.currentTime;
    [440, 660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.055);
      gain.gain.linearRampToValueAtTime(0.12, t + i * 0.055 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.055 + 0.09);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + i * 0.055);
      osc.stop(t + i * 0.055 + 0.1);
    });
  }

  // Start construction ambience (drill + gravel rumble loop)
  public startAmbience() {
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain || this.ambienceRunning || !this.noiseBuffer) return;
    this.ambienceRunning = true;

    // Low rumble oscillator
    const rumbleOsc = ctx.createOscillator();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.value = 52;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = this.isMuted ? 0 : 0.04;
    rumbleOsc.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    rumbleOsc.start();

    // Filtered noise (wind + machinery)
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;
    noiseSource.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 400;
    noiseFilter.Q.value = 0.5;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = this.isMuted ? 0 : 0.03;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start();

    this.ambienceNodes = [rumbleOsc, rumbleGain, noiseSource, noiseFilter, noiseGain];
  }

  // Stop ambience
  public stopAmbience() {
    if (!this.ambienceRunning) return;
    try {
      this.ambienceNodes.forEach((n) => {
        try { (n as any).stop?.(); } catch {}
        try { n.disconnect(); } catch {}
      });
    } catch {}
    this.ambienceNodes = [];
    this.ambienceRunning = false;
  }

  // Play success chime (asset added to scene)
  public playSuccess() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain) return;
    const t = ctx.currentTime;
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.18, t + i * 0.07 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.25);
    });
  }
}

export const soundEngine = new SoundEngine();
