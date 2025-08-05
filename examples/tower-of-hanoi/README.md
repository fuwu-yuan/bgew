# 🗼 Tower of Hanoi – BGEW Example

This project is a simple example implementation of the **Tower of Hanoi** game using the **[BGEW](https://github.com/fuwu-yuan/bgew)** game engine.

It demonstrates the minimal structure of a BGEW-based game, with a scene, steps, and basic drag-and-drop logic.

---

## 🎮 Run the Game

Make sure you’ve installed the dependencies from the root of the BGEW project:

```bash
npm install
```

Then, to run this game:

```bash
npm start
```

The game will be available in your browser (usually at [http://localhost:3000](http://localhost:3000) or similar, depending on your setup).

---

## 🗂 Folder Structure

```
examples/tower-of-hanoi/
├── assets/               # Images, sounds, and other static resources
├── dist/                 # Build output folder (generated)
├── node_modules/         # Dependencies (generated)
├── src/
│   ├── classes/          # Core classes (Dispatcher, Solver, etc.)
│   ├── entities/         # Game entities (Column, Piece)
│   ├── settings/         # Configuration files (globals, mappings)
│   ├── steps/            # Game steps logic (main.step.ts)
│   └── main.ts           # Main entry point
├── index.html            # HTML page hosting the game canvas
├── package.json          # Project dependencies and scripts
├── package-lock.json
└── README.md             # This file
```

---

## 📦 Dependencies

This example depends on:

- `@fuwu-yuan/bgew` – the game engine
- `esbuild` – for fast bundling and development server

---

## 💡 Notes

- The HTML page only contains a `#game` div, where the game is rendered.
- You can customize canvas size, game name/version, and logic in `globals.ts`.

---

## 🧠 About Tower of Hanoi

The Tower of Hanoi is a mathematical puzzle consisting of three rods and a number of disks of different sizes. The objective is to move the entire stack to another rod, following these rules:

1. Only one disk may be moved at a time.
2. Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty rod.
3. No disk may be placed on top of a smaller disk.

---

Happy coding! Happy playing !
