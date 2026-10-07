export class GameLoop {
  private frame = 0;
  private previous = 0;
  private disposed = false;
  constructor(private readonly update: (delta: number) => void) {}
  start(): void { document.addEventListener('visibilitychange', this.visibility); this.resume(); }
  private readonly tick = (time: number): void => {
    if (this.disposed) return;
    const delta = Math.min((time - (this.previous || time)) / 1000, 0.05);
    this.previous = time; this.update(delta); this.frame = requestAnimationFrame(this.tick);
  };
  private resume(): void { this.previous = 0; this.frame = requestAnimationFrame(this.tick); }
  private readonly visibility = (): void => {
    cancelAnimationFrame(this.frame);
    if (!document.hidden && !this.disposed) this.resume();
  };
  dispose(): void { this.disposed = true; cancelAnimationFrame(this.frame); document.removeEventListener('visibilitychange', this.visibility); }
}
