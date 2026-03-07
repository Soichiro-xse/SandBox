import * as Tone from 'tone';

export class SoundEngine {
  constructor() {
    this.initialized = false;
    this.enabled = true;
    this.currentTheme = 'moonlitLake';
  }

  async init() {
    if (this.initialized) return;
    await Tone.start();

    // Master effects chain
    this.reverb = new Tone.Reverb({
      decay: 6,
      wet: 0.7,
      preDelay: 0.1,
    }).toDestination();
    await this.reverb.generate();

    this.delay = new Tone.PingPongDelay({
      delayTime: '8n.',
      feedback: 0.3,
      wet: 0.25,
    }).connect(this.reverb);

    this.chorus = new Tone.Chorus({
      frequency: 0.5,
      delayTime: 3.5,
      depth: 0.7,
      wet: 0.3,
    }).connect(this.delay);
    this.chorus.start();

    this.filter = new Tone.Filter({
      frequency: 2000,
      type: 'lowpass',
      rolloff: -12,
    }).connect(this.chorus);

    // Ambient pad synth
    this.padSynth = new Tone.PolySynth(Tone.FMSynth, {
      maxPolyphony: 6,
      voice: {
        harmonicity: 3,
        modulationIndex: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 2, decay: 1, sustain: 0.8, release: 4 },
        modulation: { type: 'triangle' },
        modulationEnvelope: { attack: 1, decay: 0.5, sustain: 0.3, release: 2 },
      },
      volume: -20,
    }).connect(this.reverb);

    // Ripple synth - bell-like tones
    this.rippleSynth = new Tone.PolySynth(Tone.AMSynth, {
      maxPolyphony: 8,
      voice: {
        harmonicity: 3.5,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 1.5, sustain: 0, release: 2 },
        modulation: { type: 'square' },
        modulationEnvelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.5 },
      },
      volume: -14,
    }).connect(this.filter);

    // Water drop synth
    this.dropSynth = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 6,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.8 },
      volume: -18,
    }).connect(this.delay);

    // Shimmer synth for movement
    this.shimmerSynth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 4,
      voice: {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, decay: 0.3, sustain: 0.1, release: 1 },
      },
      volume: -24,
    }).connect(this.reverb);

    // Noise for water ambience
    this.waterNoise = new Tone.Noise({
      type: 'pink',
      volume: -35,
    });
    this.noiseFilter = new Tone.AutoFilter({
      frequency: 0.08,
      baseFrequency: 100,
      octaves: 3,
      wet: 1,
    }).connect(this.reverb);
    this.noiseFilter.start();
    this.waterNoise.connect(this.noiseFilter);
    this.waterNoise.start();

    // Ambient loop
    this._startAmbientLoop();

    this.initialized = true;
  }

  _getScaleNotes() {
    const scales = {
      moonlitLake: ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5'],
      deepOcean: ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C4', 'Eb4', 'F4'],
      hotSpring: ['G3', 'A3', 'B3', 'D4', 'E4', 'G4', 'A4', 'B4'],
      cosmicFluid: ['E3', 'G#3', 'B3', 'D#4', 'E4', 'G#4', 'B4', 'D#5'],
      aurora: ['A3', 'C#4', 'E4', 'F#4', 'A4', 'C#5', 'E5', 'F#5'],
    };
    return scales[this.currentTheme] || scales.moonlitLake;
  }

  _getChordNotes() {
    const chords = {
      moonlitLake: [['D3', 'F#3', 'A3'], ['E3', 'A3', 'B3'], ['B2', 'D3', 'F#3']],
      deepOcean: [['C2', 'Eb2', 'G2'], ['F2', 'Ab2', 'C3'], ['Bb1', 'D2', 'F2']],
      hotSpring: [['G2', 'B2', 'D3'], ['E2', 'G2', 'B2'], ['A2', 'D3', 'E3']],
      cosmicFluid: [['E2', 'G#2', 'B2'], ['B1', 'D#2', 'F#2'], ['G#2', 'B2', 'E3']],
      aurora: [['A2', 'C#3', 'E3'], ['F#2', 'A2', 'C#3'], ['E2', 'A2', 'B2']],
    };
    return chords[this.currentTheme] || chords.moonlitLake;
  }

  _startAmbientLoop() {
    if (this.ambientLoop) {
      this.ambientLoop.dispose();
    }

    this.ambientLoop = new Tone.Loop((time) => {
      if (!this.enabled) return;
      const chords = this._getChordNotes();
      const chord = chords[Math.floor(Math.random() * chords.length)];
      this.padSynth.triggerAttackRelease(chord, '2m', time, 0.15);
    }, '4m');
    this.ambientLoop.start(0);
    Tone.getTransport().start();
  }

  playRipple(x, y, intensity = 0.5) {
    if (!this.initialized || !this.enabled) return;

    const notes = this._getScaleNotes();
    const noteIndex = Math.floor(y * notes.length);
    const note = notes[Math.min(noteIndex, notes.length - 1)];

    // Play bell tone
    const velocity = 0.2 + intensity * 0.5;
    this.rippleSynth.triggerAttackRelease(note, '4n', undefined, velocity);

    // Occasional water drop
    if (Math.random() < 0.4) {
      const dropPitch = 60 + x * 80;
      Tone.getTransport().scheduleOnce((t) => {
        this.dropSynth.triggerAttackRelease(dropPitch, '8n', t, 0.3 * intensity);
      }, `+${0.05 + Math.random() * 0.1}`);
    }
  }

  playDrag(x, y, velocity) {
    if (!this.initialized || !this.enabled) return;

    const notes = this._getScaleNotes();
    const noteIndex = Math.floor(y * notes.length);
    const note = notes[Math.min(noteIndex, notes.length - 1)];

    const vel = Math.min(velocity * 0.3, 0.4);
    if (vel > 0.05) {
      this.shimmerSynth.triggerAttackRelease(note, '16n', undefined, vel);
    }
  }

  setTheme(themeName) {
    this.currentTheme = themeName;
    if (this.initialized) {
      this._startAmbientLoop();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.waterNoise.volume.value = -Infinity;
    } else {
      this.waterNoise.volume.value = -35;
    }
    return this.enabled;
  }

  dispose() {
    if (this.ambientLoop) this.ambientLoop.dispose();
    Tone.getTransport().stop();
  }
}
