# Entités (Entities)

BGEW expose une hiérarchie d'entités. La plupart des jeux d'exemple (Particles, Kobbo Online, Tower of Hanoi) utilisent ces entités pour composer l'affichage et la logique. citeturn1view1 citeturn1view2 citeturn2view2

## Classe de base : `Entity` (concept)
Propriétés communes :
- `x`, `y` — position
- `width`, `height`
- `visible`
- `zIndex` (ou ordre de rendu)
- `update(delta)` — logique frame
- `render(ctx)` — dessin sur le canvas

## Entities fournies
- **Label** — texte. Usage connu dans README.
```ts
const label = new Entities.Label(10,10,"Score: 0", board.ctx);
label.fontSize = 24;
board.addEntity(label);
```
(Extrait et pattern tiré du README BGEW). citeturn5view0

- **Image** — wrapper autour d'un `HTMLImageElement` ou chemin d'asset.
```ts
const img = new Image();
img.src = '/assets/player.png';
const e = new Entities.Image(100,100,img, board.ctx);
board.addEntity(e);
```

- **Sprite** — animation par frames (image contenant plusieurs frames). Méthodes usuelles : `play()`, `stop()`, `gotoFrame(n)`.

## Container — entité de regroupement (approfondissement demandé)
Le `Container` est une entité spéciale qui **contient d'autres entités** et permet :
- regrouper plusieurs entités pour appliquer une transformation commune (translation, scale, rotation, alpha),
- gérer l'ordre local d'affichage (`container.add(child)` détermine l'ordre),
- propager `update(delta)` et `render(ctx)` aux enfants,
- masquer / afficher / activer l'ensemble en changeant une seule propriété du container,
- gerer la hiérarchie pour collisions locales (hitTest relatif au container).

### API conseillée / patterns d'utilisation (exemples)
> Remarque : les noms de méthodes ci‑dessous sont les patterns usuels pour ce type d'objet. Vérifie les signatures exactes dans `lib/engine/entities` si tu veux la correspondance exacte.

```ts
const group = new Entities.Container(50, 50); // position du container
const spriteA = new Entities.Image(0,0, imgA, board.ctx);
const spriteB = new Entities.Image(100,0, imgB, board.ctx);

group.add(spriteA);
group.add(spriteB);
group.x = 200; // toutes les enfants sont dessinées à offset +200
group.scale = 1.2; // scale global
board.addEntity(group);

// update propagate example
group.update = function(delta) {
  // logique container-level (ex: animation globale)
  this.children.forEach(c => c.update(delta));
};
```

### Pourquoi utiliser un Container ?
- organiser le code (regrouper UI, éléments d'un niveau),
- appliquer transformations globales (caméra locale),
- simplifier la synchronisation côté réseau (envoyer la position du container plutôt que toutes les entités enfant).

Si tu veux, je peux générer une page dédiée qui extrait signatures exactes des méthodes `Container` directement depuis le fichier source (ligne par ligne).
