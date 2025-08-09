# Cheat‑Sheet

- **Créer le board**
  ```ts
  const board = new Board("Game","0.1", 960,540, document.getElementById("game"), "#000", false, true);
  ```
- **Entité rectangle**
  ```ts
  const r = new Entities.Rectangle(100,100,80,40); board.addEntity(r);
  r.fillColor="#fff"; r.strokeColor="#111";
  ```
- **Texte**
  ```ts
  const lbl = new Entities.Label(12,24,"Hello", board.ctx); lbl.fontColor="#e5e7eb";
  ```
- **Input clavier**
  ```ts
  board.onKeyboardEvent("keydown", e=>console.log(e.key));
  ```
- **Timer**
  ```ts
  const t = board.addTimer(1000, ()=>{/*...*/}, true);
  ```
- **Sons**
  ```ts
  board.registerSound("click", "/click.ogg");
  board.playSound("click");
  ```
- **États/Steps**
  ```ts
  board.addStep(new MainMenu(board)); board.addStep(new Game(board));
  board.moveToStep("game");
  ```
