
export const uiFeedback = {
  // Syntetisoitu onnistumisääni (iloinen "pling")
  playSuccess() {
    this.vibrate(40); // Lyhyt, pehmeä tärinä
    this.playSound(587.33, 'triangle', 0.1, 0.2); // D5
    setTimeout(() => this.playSound(880.00, 'triangle', 0.1, 0.2), 100); // A5
  },

  // Syntetisoitu virheääni (matala "buzz")
  playError() {
    this.vibrate([150, 100, 150]); // Voimakkaampi "kaksois-thud"
    this.playSound(220, 'sawtooth', 0.2, 0.3); // A3
    this.playSound(110, 'sawtooth', 0.2, 0.3); // A2
  },

  vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  playSound(freq: number, type: OscillatorType, volume: number, duration: number) {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio feedback failed", e);
    }
  }
};
