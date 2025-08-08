# Architecture core

## Principaux composants
- **Board** — conteneur principal : canvas, context, gestion des entités, steps et game loop.
- **GameStep** — écran / état (menu, niveau, écran de jeu). Contient la logique `update` et le lifecycle `onEnter` / `onLeave`.
- **Entity** — classe de base pour tout objet renderable (Label, Image, Sprite, Container...).
- **Dispatcher** — gestionnaire d'événements (souris, clavier, events custom).
- **Gameloop / Timer** — mécanisme d'update + rendu basé sur `requestAnimationFrame`.
- **Network** — module simplifié (create/join room) pour multi-joueurs.

> Le README du projet liste ces concepts et fournit des exemples d'init. citeturn5view0

## Board — exemples d'usage
- `new Board(name, version, width, height, domElement, background?)`
- `board.addSteps([stepA, stepB])`
- `board.step = myStep`
- `board.start() / board.stop()`
- `board.addEntity(entity) / board.removeEntity(entity)`
- `board.onMouseEvent(type, callback)` — wrapper pour gérer les événements souris

### Exemple : écouter un clic
```ts
board.onMouseEvent('click', (e, x, y) => {
  console.log('clic à', x, y);
});
```

## GameStep — cycle
- `constructor(board)`
- `onEnter()` — appelé quand le step devient actif
- `onLeave()` — cleanup
- `update(delta)` — logique par frame
- `render(ctx?)` — (optionnel) pour rendu custom

### Exemple minimal
```ts
import { GameStep, Entities } from "@fuwu-yuan/bgew";

export class MainStep extends GameStep {
  constructor(board) {
    super(board);
    const title = new Entities.Label(0,0,board.name, board.ctx);
    board.addEntity(title);
  }

  onEnter() { /* attach listeners */ }
  update(delta) { /* logique */ }
}
```
