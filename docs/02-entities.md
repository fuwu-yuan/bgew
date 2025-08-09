# Entities — Catalogue

Import rapide :

```ts
import {Entities} from "@fuwu-yuan/bgew";
// new Entities.Rectangle(...), new Entities.Label(...), etc.
```

## Rectangle
Props principales : `fillColor`, `strokeColor`, variantes `hover*` / `click*`, `radius` (coins : `{tl,tr,br,bl}`), `clicked` (RO).
Écouteurs intégrés sur `mousedown/mouseup/mouseenter/mouseleave` pour les états.

```ts
const box = new Entities.Rectangle(100, 100, 120, 64);
box.fillColor = "rgba(59,130,246,0.2)";
box.strokeColor = "#3b82f6";
board.addEntity(box);
```

## Label (texte)
Props : `text`, `fontFamily`, `fontSize`, `fontColor`, `hoverFontColor`, `clickFontColor`, `hoverFontSize`, `clickFontSize`, `hoverCursor`.
`height` dépend du nombre de lignes (`\n`).

```ts
const title = new Entities.Label(24, 36, "Hello BGEW", board.ctx);
title.fontSize = 28;
title.fontColor = "#e5e7eb";
board.addEntity(title);
```

## Button
Props (normal/hover/click/disabled) : `fillColor`, `strokeColor`, `fontSize`, `fontColor` (+ variantes), `hoverCursor`.
Événements : `onMouseEvent("click", ...)`.

## Line
Constructeur `(x1,y1,x2,y2, color?)`. Props : `x1,y1,x2,y2,color,length`.

## Oval (ellipse/cercle)
Constructeur `(centerX, centerY, radiusX, radiusY, colors?)` — mêmes familles de couleurs que `Rectangle`.
Collision via `Circle` adapté.

## Image
Constructeur `(src, x, y, width=0, height=0, sourceX?, sourceY?, sourceW?, sourceH?, isVideo=false)`.
Charge un `HTMLImageElement` (ou `HTMLVideoElement` si `isVideo=true`), mise à l’échelle si `width/height=0` → taille native.

## Video
Hérite d’`Image` et expose `mute(muted=true)`.

## SpriteSheetImage
Animation par frames définies :

```ts
const sprite = new Entities.SpriteSheetImage("/assets/hero.png", 200, 240, 64, 64);
sprite.spriteSheetWidth = 256;   // px de la spritesheet
sprite.spriteSheetHeight = 64;
sprite.spritesCountX = 4;        // 4 frames en X
sprite.spritesCountY = 1;
sprite.addAnimation("run", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}], 90); // 90ms/frame
sprite.animate("run");
board.addEntity(sprite);
```

API : `addAnimation(name, frames: {x,y}[], speedMs)`, `animate(name, speedOverride?)`, `pause(bool)`, `nextFrame()`,
`currentAnimation`, `currentAnimationFrameIndex`, `spriteX/Y` (sélection de tuile), `spriteSheetWidth/Height`, `spritesCountX/Y`.

## Container
Regroupe des entités et gère la propagation d’`intersect` et des events.
- `entities: Entity[]` (+ `addChild(e)`, `removeChild(e)`), `findEntity(id, recursive=false)`.
- Les positions enfants sont relatives au container (`absX/absY` pour l’absolu).

## Checkbox / Inputtext (UI)
- **Checkbox** : booléen cliquable, mêmes propriétés de couleurs que `Rectangle`.
- **Inputtext** : champ texte HTML positionné par le moteur. API : `text` (valeur), `onchange(cb)`, `onfocus(cb)`, `onblur(cb)` ; styles via props (padding, font, couleurs, focus/disabled/placeholder…).
