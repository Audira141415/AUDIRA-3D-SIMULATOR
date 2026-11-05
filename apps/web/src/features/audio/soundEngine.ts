// Procedural Web Audio Engine for AUDIRA 3D Simulator
// Generates vehicle engine revs, horn harmonics, air brakes, turn signals, placement clicks, and crash SFX entirely in browser
import { useVehicleAudioStore } from '../../stores/useVehicleAudioStore';

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

  // Custom audio playback elements
  private customEngineAudio: HTMLAudioElement | null = null;
  private customHornAudio: HTMLAudioElement | null = null;
  private musicAudio: HTMLAudioElement | null = null;

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

      // Create white noise buffer for wind/gravel/skid/air brakes
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
    if (this.musicAudio) {
      this.musicAudio.muted = this.isMuted;
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

  // Play vehicle horn (custom uploaded sound or procedural dual-tone)
  public playHorn() {
    const mixer = useVehicleAudioStore.getState();
    const volumeFactor = mixer.hornMuted ? 0 : mixer.hornVolume / 100;
    if (volumeFactor <= 0 || this.isMuted) return;

    // 1. If custom horn file uploaded, play it
    if (mixer.customHornUrl) {
      try {
        if (!this.customHornAudio) {
          this.customHornAudio = new Audio();
        }
        this.customHornAudio.src = mixer.customHornUrl;
        this.customHornAudio.volume = Math.min(1, 0.85 * volumeFactor);
        this.customHornAudio.currentTime = 0;
        this.customHornAudio.play().catch(() => {});
        return;
      } catch (err) {
        console.warn('Failed custom horn audio, falling back to procedural:', err);
      }
    }

    // 2. Procedural dual-tone European truck / car horn
    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const isTruck = mixer.engineProfile === 'truck' || mixer.engineProfile === 'tractor';
    const freqs = isTruck ? [310, 392] : [380, 480]; // Deeper horn for trucks

    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);

      // Lowpass filter to smooth harshness
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = isTruck ? 1300 : 1600;

      const baseGain = (isTruck ? 0.28 : 0.2) * volumeFactor;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(baseGain, t + 0.03);
      gain.gain.setValueAtTime(baseGain, t + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // Play pneumatic air brake hiss sound (truck / bus deceleration)
  public playAirBrake() {
    const mixer = useVehicleAudioStore.getState();
    const volumeFactor = mixer.brakeMuted ? 0 : mixer.brakeVolume / 100;
    if (volumeFactor <= 0 || this.isMuted) return;

    const ctx = this.initCtx();
    if (!ctx || !this.masterGain || !this.noiseBuffer) return;

    const t = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.exponentialRampToValueAtTime(900, t + 0.35);
    filter.Q.value = 1.8;

    const gain = ctx.createGain();
    const peakGain = 0.4 * volumeFactor;
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(peakGain, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(t);
    source.stop(t + 0.42);
  }

  // Play turn signal blinker click (tik-tok relay)
  public playBlinker(isTick: boolean = true) {
    const mixer = useVehicleAudioStore.getState();
    const volumeFactor = mixer.blinkerMuted ? 0 : mixer.blinkerVolume / 100;
    if (volumeFactor <= 0 || this.isMuted) return;

    const ctx = this.initCtx();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isTick ? 1400 : 950, t);
    osc.frequency.exponentialRampToValueAtTime(isTick ? 800 : 500, t + 0.025);

    const level = 0.12 * volumeFactor;
    gain.gain.setValueAtTime(level, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.04);
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
    const mixer = useVehicleAudioStore.getState();
    const volumeFactor = mixer.engineMuted ? 0 : mixer.engineVolume / 100;

    // If custom engine loop uploaded
    if (mixer.customEngineUrl) {
      try {
        if (!this.customEngineAudio) {
          this.customEngineAudio = new Audio();
          this.customEngineAudio.loop = true;
        }
        this.customEngineAudio.src = mixer.customEngineUrl;
        this.customEngineAudio.volume = Math.min(1, 0.7 * volumeFactor);
        this.customEngineAudio.currentTime = 0;
        this.customEngineAudio.play().catch(() => {});
        this.engineRunning = true;
        return;
      } catch (err) {
        console.warn('Failed custom engine audio, using procedural:', err);
      }
    }

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
    this.engineGain.gain.value = 0.08 * volumeFactor;

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

  // Update engine pitch & volume based on speed and profile
  public updateEngine(speedRatio: number, isAccelerating: boolean) {
    const mixer = useVehicleAudioStore.getState();
    const volumeFactor = mixer.engineMuted ? 0 : mixer.engineVolume / 100;

    // Handle custom engine sound playback rate
    if (this.customEngineAudio && mixer.customEngineUrl) {
      this.customEngineAudio.volume = this.isMuted ? 0 : Math.min(1, (0.4 + speedRatio * 0.5) * volumeFactor);
      this.customEngineAudio.playbackRate = Math.max(0.75, Math.min(2.0, 0.8 + speedRatio * 1.1));
      return;
    }

    if (!this.engineRunning || !this.ctx) {
      if (speedRatio > 0.01 || isAccelerating) {
        this.startEngine();
      }
      return;
    }

    const t = this.ctx.currentTime;
    const profile = mixer.engineProfile;

    // Profile-specific audio synthesis parameters
    let baseFreq = 42 + speedRatio * 90 + (isAccelerating ? 22 : 0);
    let filterFreq = 320 + speedRatio * 800 + (isAccelerating ? 250 : 0);
    let volume = (0.06 + speedRatio * 0.14 + (isAccelerating ? 0.05 : 0)) * volumeFactor;

    if (profile === 'truck' || profile === 'tractor') {
      baseFreq = 32 + speedRatio * 65 + (isAccelerating ? 15 : 0);
      filterFreq = 260 + speedRatio * 520 + (isAccelerating ? 180 : 0);
      volume = (0.08 + speedRatio * 0.18 + (isAccelerating ? 0.07 : 0)) * volumeFactor;
    } else if (profile === 'sport' || profile === 'supercar') {
      baseFreq = 75 + speedRatio * 160 + (isAccelerating ? 45 : 0);
      filterFreq = 500 + speedRatio * 1400 + (isAccelerating ? 400 : 0);
      volume = (0.05 + speedRatio * 0.18 + (isAccelerating ? 0.06 : 0)) * volumeFactor;
    } else if (profile === 'plane') {
      baseFreq = 120 + speedRatio * 180 + (isAccelerating ? 30 : 0);
      filterFreq = 700 + speedRatio * 1600;
      volume = (0.07 + speedRatio * 0.16) * volumeFactor;
    }

    if (this.engineOscA) this.engineOscA.frequency.setTargetAtTime(baseFreq, t, 0.08);
    if (this.engineOscB) this.engineOscB.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.08);
    if (this.engineOscSub) this.engineOscSub.frequency.setTargetAtTime(baseFreq * 0.25, t, 0.08);
    if (this.engineFilter) this.engineFilter.frequency.setTargetAtTime(filterFreq, t, 0.1);
    if (this.engineGain) this.engineGain.gain.setTargetAtTime(this.isMuted ? 0 : volume, t, 0.08);
  }

  // Stop engine audio
  public stopEngine() {
    if (this.customEngineAudio) {
      try {
        this.customEngineAudio.pause();
        this.customEngineAudio.currentTime = 0;
      } catch {}
    }

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

  // Play In-Game Music Track
  public playMusic(trackUrl?: string) {
    const mixer = useVehicleAudioStore.getState();
    const volumeFactor = mixer.musicMuted ? 0 : mixer.musicVolume / 100;

    if (trackUrl) {
      if (!this.musicAudio) {
        this.musicAudio = new Audio();
        this.musicAudio.loop = true;
      }
      this.musicAudio.src = trackUrl;
      this.musicAudio.volume = this.isMuted ? 0 : Math.min(1, 0.8 * volumeFactor);
      this.musicAudio.play().catch(() => {});
    }
  }

  public setMusicVolume(volume: number) {
    if (this.musicAudio) {
      this.musicAudio.volume = this.isMuted ? 0 : Math.min(1, (volume / 100) * 0.8);
    }
  }

  public pauseMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
  }

  public resumeMusic() {
    if (this.musicAudio) {
      this.musicAudio.play().catch(() => {});
    }
  }

  public stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
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
    const mixer = useVehicleAudioStore.getState();
    const volumeFactor = mixer.ambientMuted ? 0 : mixer.ambientVolume / 100;
    if (volumeFactor <= 0) return;

    const ctx = this.initCtx();
    if (!ctx || !this.masterGain || this.ambienceRunning || !this.noiseBuffer) return;
    this.ambienceRunning = true;

    // Low rumble oscillator
    const rumbleOsc = ctx.createOscillator();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.value = 52;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = (this.isMuted ? 0 : 0.04) * volumeFactor;
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
    noiseGain.gain.value = (this.isMuted ? 0 : 0.03) * volumeFactor;
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

  // Rain nodes
  private rainNodes: AudioNode[] = [];
  private rainRunning: boolean = false;

  // Rain Ambience Loop
  public playRainAmbience() {
    if (this.rainRunning) return;
    const ctx = this.initCtx();
    if (!ctx || !this.noiseBuffer || !this.masterGain) return;

    this.rainRunning = true;
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;
    noiseSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 1400;

    const rainGain = ctx.createGain();
    rainGain.gain.value = this.isMuted ? 0 : 0.09;

    noiseSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);
    noiseSource.start();

    this.rainNodes = [noiseSource, rainFilter, rainGain];
  }

  public stopRainAmbience() {
    if (!this.rainRunning) return;
    try {
      this.rainNodes.forEach((n) => {
        try { (n as any).stop?.(); } catch {}
        try { n.disconnect(); } catch {}
      });
    } catch {}
    this.rainNodes = [];
    this.rainRunning = false;
  }

  // Thunder Sound
  public playThunder() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain || !this.noiseBuffer) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 1.8);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 2.3);

    // Filtered noise crack
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(150, t + 1.5);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 2.1);
  }

  // Obstacle Crash Bump
  public playCrashBump() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain || !this.noiseBuffer) return;
    const t = ctx.currentTime;

    // Metallic low thump
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.42);

    // Crunch noise
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.Q.value = 1.2;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 0.32);
  }

  // Nitro Boost Sound
  private nitroNodes: AudioNode[] = [];
  private nitroRunning: boolean = false;

  public playNitroBoost() {
    if (this.nitroRunning) return;
    const ctx = this.initCtx();
    if (!ctx || !this.noiseBuffer || !this.masterGain) return;
    this.nitroRunning = true;
    const t = ctx.currentTime;

    // Jet rush noise
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(1600, t + 0.5);
    filter.Q.value = 2.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.35, t + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);

    // High whine osc
    const whine = ctx.createOscillator();
    whine.type = 'sine';
    whine.frequency.setValueAtTime(320, t);
    whine.frequency.exponentialRampToValueAtTime(950, t + 0.6);

    const whineGain = ctx.createGain();
    whineGain.gain.setValueAtTime(0.01, t);
    whineGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.08, t + 0.3);

    whine.connect(whineGain);
    whineGain.connect(this.masterGain);
    whine.start(t);

    this.nitroNodes = [noise, filter, gain, whine, whineGain];
  }

  public stopNitroBoost() {
    if (!this.nitroRunning) return;
    try {
      this.nitroNodes.forEach((n) => {
        try { (n as any).stop?.(); } catch {}
        try { n.disconnect(); } catch {}
      });
    } catch {}
    this.nitroNodes = [];
    this.nitroRunning = false;
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

  // Play error buzz (invalid action)
  public playError() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted || !this.masterGain) return;
    const t = ctx.currentTime;
    [320, 240].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, t + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.14);
    });
  }

  // Play carnival / background ambient music
  public playCarnivalMusic() {
    const carnivalTrack = 'https://assets.mixkit.co/music/preview/mixkit-carnival-parade-497.mp3';
    this.playMusic(carnivalTrack);
  }
}

export const soundEngine = new SoundEngine();
