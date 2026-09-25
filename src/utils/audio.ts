/**
 * Web Audio API synthesizer for TideMind
 * Pure procedural audio - no external sound files required.
 */

let audioCtx: AudioContext | null = null;
let oceanNoiseNode: AudioBufferSourceNode | null = null;
let oceanGainNode: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Procedural continuous ocean ambient sound:
 * Synthesizes 5 seconds of looped pink/brown noise through a modulated
 * resonant lowpass filter mimicking rolling deep ocean waves and tidal swells.
 */
export function setOceanSound(enabled: boolean): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (!enabled) {
      if (oceanGainNode) {
        oceanGainNode.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4);
      }
      return;
    }

    if (oceanNoiseNode && oceanGainNode) {
      // Fade back in
      oceanGainNode.gain.setTargetAtTime(0.065, ctx.currentTime, 0.5);
      return;
    }

    // Generate 5-second stereophonic ocean noise buffer
    const bufferSize = ctx.sampleRate * 5;
    const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const output = noiseBuffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }
    }

    oceanNoiseNode = ctx.createBufferSource();
    oceanNoiseNode.buffer = noiseBuffer;
    oceanNoiseNode.loop = true;

    // Resonant lowpass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, ctx.currentTime);
    filter.Q.setValueAtTime(2.2, ctx.currentTime);

    // LFO to modulate filter frequency like ocean waves (every ~7 seconds)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.14, ctx.currentTime); // ~7.1s wave period
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    oceanGainNode = ctx.createGain();
    oceanGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    oceanGainNode.gain.linearRampToValueAtTime(0.065, ctx.currentTime + 1.2);

    oceanNoiseNode.connect(filter);
    filter.connect(oceanGainNode);
    oceanGainNode.connect(ctx.destination);

    oceanNoiseNode.start(0);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a low soft "verify" chime when a BRCV verdict appears:
 * Resonant ascending twin tones (523Hz + 659Hz) with smooth decay.
 */
export function playVerifyChime(enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.5);
    });
  } catch {
    // Ignore
  }
}

/**
 * Play a high-tech underwater sonar ping:
 * Sine wave 880Hz gliding down to 440Hz over 400ms, with soft exponential decay.
 */
export function playSonarPing(enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warm resonant bandpass to simulate acoustic underwater propagation
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    osc.type = 'sine';
    const now = ctx.currentTime;
    
    // 880Hz falling to 440Hz
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.38);

    // Soft volume envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  } catch {
    // Graceful fallback if audio is not permitted yet
  }
}

/**
 * Play a soft low tick on hover:
 * ~120Hz click, 30ms duration, very quiet.
 */
export function playHoverTick(enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;
    
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.03);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.025, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Ignore audio permission warnings
  }
}
