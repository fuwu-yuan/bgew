# Installation et démarrage rapide

## Installation (méthode recommandée)
```
mkdir my-game
cd my-game
npm init -y
npm install --save-dev typescript @types/node esbuild serve
npm install @fuwu-yuan/bgew
```

## Structure recommandée
```
my-game/
├── assets/
├── src/
│   ├── steps/
│   │   └── main.step.ts
│   └── main.ts
├── index.html
├── package.json
```

## Exemple minimal (main.ts)
```ts
import { Board } from "@fuwu-yuan/bgew";
import { MainStep } from "./steps/main.step";

const board = new Board(
  "My Game",
  "0.0.1",
  800,
  600,
  document.getElementById("game"),
  "white"
);

const mainStep = new MainStep(board);
board.addSteps([mainStep]);
board.step = mainStep;
board.start();
```

Ce snippet est directement inspiré du README officiel de BGEW. citeturn5view0
