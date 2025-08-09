# Architecture — Board, GameStep, Entity

## Board
Le **Board** est la racine du jeu : taille, canvas, boucle, pas de jeu (*GameStep*), collisions, sons, debug.

```ts
import {Board} from "@fuwu-yuan/bgew";
import {MainStep} from "./steps/main.step";

const board = new Board(
  "My Game", "0.1.0",
  960, 540,
  document.getElementById("game"), // conteneur DOM (div) ou null => body
  "#10141f",                        // background
  false,                            // HiDPI
  true                              // collision system
);
board.step = new MainStep(board);
board.start();
```

### Méthodes clés (Board)
- `start()` / `stop()` / `pause()` / `resume()` — contrôle de la boucle.
- `addStep(step: GameStep)` / `addSteps(steps: GameStep[])` — enregistre les steps.
- `moveToStep(stepName: string, data: any = {}, fade?: {color: string, duration: number})` — changer d’écran avec fade optionnel.
- `addEntity(e: Entity)` / `addEntities(e: Entity[])` — ajoute au *display list* courant.
- `removeEntity(e)` / `removeEntities(list)` — retire du *display list*.
- `getEntitiesAt(x?: number, y?: number)` — entités sous un point (utilise la géométrie des entités).
- `getEntitiesIn(x1, y1, x2, y2)` — entités dans une AABB.
- `addTimer(timeMs, cb, repeat=false)` / `removeTimer(timer)` — raccourcis vers `GameStep`.
- `onMouseEvent(type, (evt, x, y)=>{})` — écouteur global souris : `click|dblclick|contextmenu|mousedown|mouseup|mouseenter|mouseleave|mousemove|all`.
- `onKeyboardEvent(type, (evt)=>{})` — écouteur global clavier : `keyup|keydown|keypress|all`.
- **Sons** : `registerSound(name, src|string[], repeat=false, volume=0.5, sprites={})`, `playSound(name, repeat?, volume?, sprite?)`, `stopSound(name, fadeout=false, fadeDuration=1000, id?)`, `getSound(name)`.
- **Utilitaires** : `changeCursor(cursor)`, `restoreCursor()`, `clear()`, `reset()`, `resetStyles()`.
- **Getters** : `canvas`, `ctx`, `width`, `height`, `scale`, `version`, `name`, `config`, `debug`, `collisionSystem`.

## GameStep
Un **GameStep** est un écran/état (menu, partie, pause…). Le moteur appelle `update()` puis `draw()` à chaque tick.

```ts
import {GameStep, Entities, Timer} from "@fuwu-yuan/bgew";

export class MainStep extends GameStep {
  name = "main";
  constructor(board){ super(board); }
  onEnter(data:any){ /* init scène, entités, timers */ }
  onLeave(){ /* cleanup */ }

  update(deltaMs:number){
    // logique frame
  }
}
```

### Méthodes & hooks (GameStep)
- `abstract onEnter(data:any)` / `abstract onLeave()` — cycle de vie.
- `update(deltaMs)` — logique (peut appeler collisions via `checkCollisions()`).
- `draw()` — rendu de toutes les entités (géré par la classe mère, tu peux surcharger pour un overlay).
- `checkCollisions()` — déclenche les callbacks d’intersection.
- `addTimer(timeMs, cb, repeat=false): Timer` / `removeTimer(timer)`.
- **Getters** : `board`, `camera` (déplacements caméra).

## Entity
**Entity** est la base de tout visuel interactif : position, taille, rotation, vitesse, corps de collision (Polygon/Circle/Poi… selon l’entité).

Propriétés (get/set lorsqu’applicable) les plus utilisées :
- Position & taille : `x`, `y`, `width`, `height`, `absX`, `absY` (avec containers).
- Visibilité & état : `visible`, `disabled`, `opacity`, `hovered`, `focus`.
- Mouvement : `speedX`, `speedY`, `angle` (radian), `angleInDegrees`, `setSpeedWithAngle(speed, angle, degrees=false)`, `speed` (setter conserve l’angle).
- Physique légère : `falling`, `weight`, `solid`, `body` (forme collision).
- Hiérarchie : `parent: Container|null`, `board: Board|null`, `id: string`.

Méthodes utiles :
- `update(deltaMs)` / `draw(ctx)` — surchargées par les sous‑classes.
- `intersect(x,y, event?: Event|null, depth=1): boolean` — hit‑test récursif via containers.
- `intersectWithEntity(e: Entity): boolean` / `intersectWithEntities(list: Entity[]): Entity[]`.
- Événements : `onMouseEvent(type, cb, options?)`, `onKeyboardEvent(type, cb, options?)`,
  `onIntersectWithEntity(entity, (self, other, result)=>{})`, `onIntersectWithAnyEntity((self, other, result)=>{})`.
