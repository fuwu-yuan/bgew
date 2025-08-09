# SpriteSheetImage
```ts
const s = new Entities.SpriteSheetImage("/assets/hero.png", 520, 140, 64, 64);
s.spriteSheetWidth = 256; s.spriteSheetHeight = 64;
s.spritesCountX = 4; s.spritesCountY = 1;
s.addAnimation("run", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}], 90);
s.animate("run");
board.addEntity(s);
```
