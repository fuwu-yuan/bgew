# 🥖 BGEW — Baguette Game Engine Web

**BGEW** is a lightweight 2D game engine written in JavaScript for Node.js and the browser. Originally a Java-based school project developed during our 4th year at EPITECH school, it has since evolved into a fully web-based engine.

---

## 📖 Backstory

BGEW was born from a school assignment where we had to build a small game using any engine. To go further, we decided to create our own engine in **Java**, our favorite language at the time.

The original version was compiled as a remote binary. It used a launcher to package games (written in JavaScript or Lua) into a single executable that downloaded the engine once on first launch.

As Java proved too heavy, the project was reimagined as a lightweight **web engine**, now known as **BGEW**.

---

## ✨ Features

- 🧱 Entity management  
- 🖼️ Image rendering & sprite animation  
- 🔊 Sound playback (music & effects)  
- 🧩 Collision detection  
- 🌍 Gravity support  
- 🏷️ Labels and input fields for UI  
- 🔄 Dynamic asset loading  
- 🛜 Simplified Network (create/join room system)

---

## 🚀 Getting Started

You can either:

### ✅ Use a starter template

This is the recommended way to start quickly.

Available starters:

- Empty project: `npm init @fuwu-yuan/bgew-empty-starter`
- Tower of Hanoi example: `npm init @fuwu-yuan/bgew-tower-starter`

---

### ⚙️ Or set up manually

#### 1. Install dependencies

```bash
mkdir my-game # Create your game
cd my-game
npm init -y # Init package.json
npm install --save-dev typescript @types/node esbuild serve # install dependencies
npm install @fuwu-yuan/bgew # Install BGEW
```

#### 2. Create your game

Organize your game like this:

```
my-game/
├── assets/               # Images, sounds, and other static resources
├── src/
│   ├── steps/            # Game steps logic
│   │   └── main.step.ts  # First step of the game
│   └── main.ts           # Main entry point
├── index.html            # HTML page hosting the game canvas
├── package.json          # Project dependencies and scripts
└── package-lock.json
```

In `main.ts`:

```ts
import {Board} from "@fuwu-yuan/bgew";
import {MainStep} from "./steps/main.step";

const board = new Board(
  "My Game",
  "0.0.1",
  800,
  600,
  document.getElementById("game"),
  "white"
);

/* Init and start board */
let mainStep = new MainStep(board);
board.step = mainStep; // First shown step
/* All Steps */
board.addSteps([
    mainStep
]);
board.start();
```

In `steps/main.step.ts`:

```ts
import {Board, Entities, GameStep} from "@fuwu-yuan/bgew";

export class MainStep extends GameStep {
    name: string = "main";
    private titleEntity: Entities.Label;

    constructor(board: Board) {
        super(board);
        this.titleEntity = new Entities.Label(0, 0, this.board.name, this.board.ctx);
        this.titleEntity.fontSize = 100;
        this.titleEntity.x = this.board.width / 2 - this.titleEntity.width / 2;
        this.titleEntity.y = this.board.height / 2 - this.titleEntity.height / 2;
        this.board.addEntity(this.titleEntity);
    }

    onEnter(): void {
        this.board.onMouseEvent('mousemove', (event, x, y) => {
            this.titleEntity.x = x - this.titleEntity.width / 2;
            this.titleEntity.y = y - this.titleEntity.height;
        });
    }

    onLeave(): void {}
    update(delta: number) {}
}
```

In `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BGEW Game</title>
  <style>
    .game-container {
      width: 100%;
      height: 100vh;
      background: #111;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
<div class="game-container">
  <div id="game"></div>
</div>
<script type="module" src="./dist/bundle.js"></script>
</body>
</html>

```

#### 3. Run your game

```bash
node_modules/.bin/esbuild src/main.ts --bundle --outfile=dist/bundle.js --format=esm --sourcemap && npx serve
```

Or use a simple web server to serve the files and load them in a browser environment.

---

## 📁 Project Structure

```
bgew
├── docs                 <!-- Project documentation, guides, and specifications -->
├── examples             <!-- Example games or demos using the BGEW engine -->
│   └── tower-of-hanoi   <!-- Tower of Hanoi game example implemented with BGEW -->
├── lib                  <!-- Main source code of the engine and its modules -->
│   ├── classes          <!-- Core TypeScript classes and utilities -->
│   │   ├── Debug.ts         <!-- Debugging tools and helper functions -->
│   │   ├── Dispatcher.ts    <!-- Event dispatcher/manager -->
│   │   ├── DispatcherEvent.ts <!-- Event definitions for the dispatcher -->
│   │   ├── Gameloop.ts      <!-- Main game loop implementation -->
│   │   └── Vector2D.ts      <!-- 2D vector math class -->
│   ├── collisionSystem  <!-- Module handling collision detection and resolution -->
│   └── engine           <!-- Internal components of the game engine -->
│       ├── entities     <!-- Game entities -->
│       ├── network      <!-- Networking and multiplayer synchronization -->
│       ├── board.ts      <!-- Game board management -->
│       ├── camera.ts     <!-- Camera control and logic -->
│       ├── config.ts     <!-- Configuration and constants -->
│       ├── entity.ts     <!-- Entity definition -->
│       ├── gamestep.ts   <!-- Game step management -->
│       ├── sound.ts      <!-- Sound system management -->
│       └── timer.ts      <!-- Time and timer management -->
├── test                 <!-- Unit and integration tests -->
├── index.ts             <!-- Main entry point of the engine/module -->
└── LICENSE              <!-- Project license -->
```

---

## 🛠️ Contributing

We welcome contributions!

1. Fork this repo  
2. Create a feature or fix branch  
3. Write your changes and add tests if needed  
4. Run tests using `npm test`  
5. Open a pull request with a clear description  

---

## 🔭 Roadmap

- [ ] Optimized web build (minification, tree-shaking)
- [ ] Template games (platformer, shooter, puzzle, etc.)
- [ ] Implement game-scoped private database access layer

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

## 👋 Credits

Created by **[@stevecohenfr](https://github.com/stevecohenfr)** based on **[@julien-beguier](https://github.com/julien-beguier)** and **[@stevecohenfr](https://github.com/stevecohenfr)** original project during our EPITECH Beijing exchange program at BJTU.  
Originally a Java engine project, now rewritten for the web.  
“Because a baguette is best when shared - so is code... and games.”
