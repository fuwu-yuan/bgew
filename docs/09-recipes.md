# Recettes (copier/coller)

## A. Bouton cliquable qui change d’écran
```ts
const btn = new Entities.Button(100, 100, 220, 56, "Jouer");
btn.fillColor = "rgba(59,130,246,.2)";
btn.hoverFillColor = "rgba(59,130,246,.35)";
btn.hoverCursor = "pointer";
btn.onMouseEvent("click", () => board.moveToStep("game", {}, {color:"#000", duration:400}));
board.addEntity(btn);
```

## B. Déplacement basique d’un joueur
```ts
class Player extends Entities.Rectangle {
  speed = 160;
  update(delta:number){
    const dt = delta/1000;
    if (keys["w"]) this.y -= this.speed*dt;
    if (keys["s"]) this.y += this.speed*dt;
    if (keys["a"]) this.x -= this.speed*dt;
    if (keys["d"]) this.x += this.speed*dt;
  }
}
const keys: Record<string,boolean> = {};
board.onKeyboardEvent("keydown", e => keys[e.key.toLowerCase()]=true);
board.onKeyboardEvent("keyup",   e => keys[e.key.toLowerCase()]=false);
```

## C. Collision/ramassage d’objets
```ts
player.onIntersectWithAnyEntity((self, other, result) => {
  if ((other as any).tag === "loot") (other as any).collected = true;
});
```

## D. Spritesheet animation
```ts
const s = new Entities.SpriteSheetImage("/s.png", 200, 200, 64,64);
s.spriteSheetWidth = 256; s.spriteSheetHeight = 64;
s.spritesCountX = 4; s.spritesCountY = 1;
s.addAnimation("run", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}], 90);
s.animate("run");
board.addEntity(s);
```
