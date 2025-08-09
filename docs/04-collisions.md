# Collisions

BGEW s’appuie sur **detect-collisions** et expose 3 formes via `lib/collisionSystem` :
`Circle`, `Polygon`, `Point` — chacune peut être liée à une `Entity` (propriété `entity`).

- Le **Board** active le système si `enableCollisionSystem=true` à la construction.
- Chaque `Entity` gère un `body` adapté (ex: `Rectangle` → `Polygon`, `Oval` → `Circle`).
- La boucle appelle `board.collisionSystem.update()` puis `gameStep.checkCollisions()`.

Utilitaires fréquents :
- `entity.intersectWithEntity(e)` / `intersectWithEntities(list)`
- `board.getEntitiesAt(x, y)` / `getEntitiesIn(x1, y1, x2, y2)`
- `Result` (de `detect-collisions`) pour séparer deux entités (ex : `self.x -= result.overlap * result.overlap_x`).

> Astuce debug : `board.debug.collision = true` dessine les corps sur le canvas.
