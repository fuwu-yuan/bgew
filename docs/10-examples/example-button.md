# Button
```ts
const btn = new Entities.Button(32, 96, 220, 56, "Start");
btn.hoverCursor = "pointer";
btn.onMouseEvent("click", () => console.log("clicked!"));
board.addEntity(btn);
```
