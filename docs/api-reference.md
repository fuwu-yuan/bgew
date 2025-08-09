# API Reference — Survol rapide

## Package exports
```ts
export { Board } from "./lib/engine/board";
export { GameStep } from "./lib/engine/gamestep";
export { Entity } from "./lib/engine/entity";
export * as Entities from "./lib/engine/entities";
export * as Network from "./lib/engine/network";
export { AbstractNetworkManager } from "./lib/engine/network/networkmanager.abstract";
export { Timer } from "./lib/engine/timer";
export { Body, Result } from "detect-collisions";
export { Vector2D } from "./lib/classes/Vector2D";
```

## Classes majeures
- **Board** : boucle, canvas, collisions, steps, sons, events.
- **GameStep** : écran/état, timers, caméra, rendu.
- **Entity** : base de toutes les entités (UI, shapes, images, etc.).
- **Entities** :
  - `Rectangle`, `Oval`, `Line`,
  - `Label`, `Button`, `Checkbox`, `Inputtext`,
  - `Image`, `Video`, `SpriteSheetImage`,
  - `Container`.
- **Network** : `NetworkManager`, `AbstractNetworkManager`, `Room`, `Response`, `Player`, `SocketMessage`.
- **Timer**, **Vector2D**.
