# Multi‑Steps Skeleton

Structure conseillée :
```
src/
  steps/
    menu.step.ts
    game.step.ts
    pause.step.ts
  main.ts
index.html
```

## `src/main.ts`
```ts
import {Board} from "@fuwu-yuan/bgew";
import {MenuStep} from "./steps/menu.step";
import {GameStep} from "./steps/game.step";
import {PauseStep} from "./steps/pause.step";

const board = new Board("My Game","0.1.0", 960,540, document.getElementById("game"), "#0b1020", false, true);
board.addSteps([ new MenuStep(board), new GameStep(board), new PauseStep(board) ]);
board.moveToStep("menu");
board.start();
```

## `src/steps/menu.step.ts`
```ts
import {GameStep, Entities} from "@fuwu-yuan/bgew";
export class MenuStep extends GameStep {
  name = "menu";
  onEnter() {
    const title = new Entities.Label(32, 48, "My Game", this.board.ctx);
    title.fontSize = 36; title.fontColor = "#e5e7eb"; this.board.addEntity(title);

    const play = new Entities.Button(32, 120, 240, 56, "Jouer");
    play.hoverCursor = "pointer";
    play.onMouseEvent("click", () => this.board.moveToStep("game", {}, {color:"#000", duration:400}));
    this.board.addEntity(play);
  }
  onLeave(){ this.board.removeEntities([...this.board.entities]); }
}
```

## `src/steps/game.step.ts`
```ts
import {GameStep, Entities} from "@fuwu-yuan/bgew";
export class GameStep extends GameStep {
  name = "game"; private pressed: Record<string,boolean> = {};
  onEnter(){
    const back = new Entities.Button(32, 32, 180, 40, "Pause (P)");
    back.onMouseEvent("click", () => this.board.moveToStep("pause"));
    this.board.addEntity(back);

    this.board.onKeyboardEvent("keydown", e => { if (e.key.toLowerCase()==="p"){ this.board.moveToStep("pause"); } });
  }
  onLeave(){ this.board.removeEntities([...this.board.entities]); }
  update(){ /* gameplay loop */ }
}
```

## `src/steps/pause.step.ts`
```ts
import {GameStep, Entities} from "@fuwu-yuan/bgew";
export class PauseStep extends GameStep {
  name = "pause";
  onEnter(){
    const lbl = new Entities.Label(200, 200, "Jeu en pause — ECHAP pour reprendre", this.board.ctx);
    lbl.fontColor = "#eab308"; this.board.addEntity(lbl);
    this.board.onKeyboardEvent("keydown", e => { if (e.key==="Escape") this.board.moveToStep("game"); });
  }
  onLeave(){ this.board.removeEntities([...this.board.entities]); }
}
```
