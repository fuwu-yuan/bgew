# Config & Debug

## BoardConfig
```ts
board.config.game.FPS = 30;
board.config.board.size = { width: 960, height: 540 };
board.config.board.background = "#10141f";
```

## Debug
```ts
board.debug.collision = true;  // affiche les shapes de collision
board.debug.skeleton  = false; // réservé (squelettes)
board.debug.stats     = false; // activer le perf HUD si intégré
```

## Curseur
`board.changeCursor("pointer")` / `board.restoreCursor()`.
