import { Game } from './core/Game';
import './ui/styles/main.css';

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('Monster World mount element is missing');
let game: Game | undefined;
try { game = new Game(app); }
catch (error) {
  console.error('[Monster World] Boot failed', error);
  app.replaceChildren();
  const message = document.createElement('p'); message.className = 'boot-error';
  message.textContent = 'The 3D world could not start. Please use a browser with WebGL 2 enabled and reload.';
  app.append(message);
}
import.meta.hot?.dispose(() => game?.dispose());
