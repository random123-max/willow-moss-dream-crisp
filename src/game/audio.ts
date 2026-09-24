/** Tiny WebAudio SFX bus. Unlock from the first gesture. */
export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  unlock() {
    if (!this.ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new C({ latencyHint: "interactive" });
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.22;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  private beep(freq: number, dur: number, type: OscillatorType, gain = 0.4) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  break() {
    this.unlock();
    this.beep(180 + Math.random() * 40, 0.08, "square", 0.35);
  }
  place() {
    this.unlock();
    this.beep(320 + Math.random() * 30, 0.06, "triangle", 0.3);
  }
  hurt() {
    this.unlock();
    this.beep(140, 0.14, "sawtooth", 0.28);
  }
  step() {
    this.unlock();
    this.beep(90 + Math.random() * 20, 0.04, "square", 0.12);
  }
}
