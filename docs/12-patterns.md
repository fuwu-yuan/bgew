# Patterns & bonnes pratiques

## Containers hiérarchiques
- Regroupe les entités d’une scène (ex: `UIContainer`, `WorldContainer`). Utilise `container.addChild(entity)`.
- Utilise `absX/absY` si tu as besoin des coordonnées absolues.

## Événements (Dispatcher)
- Préfère des events centrés `board.onKeyboardEvent()` pour les commandes globales.
- Pour des widgets UI, accroche les handlers sur l’entité (`onMouseEvent`), c’est plus précis.

## Collisions
- Active le système à la création du `Board`. Met `board.debug.collision=true` pour vérifier les shapes.
- Résous les chevauchements avec `Result.overlap`/`overlap_x`/`overlap_y` (nudging).

## Timers & gameplay
- Un `Timer` répété pour le spawn ou les patrouilles, un autre pour le HUD.
- Garde des références aux timers pour `removeTimer` en `onLeave()`.

## Rendu & DPI
- `enableHIDPI=true` si tu veux des textes plus nets sur écrans Retina.
- Évite les `ctx.save/restore` profonds par entité si tu as beaucoup d’objets.

## Bundling (esbuild)
```json
{
  "scripts": {
    "build": "esbuild src/main.ts --bundle --outfile=dist/bundle.js --format=esm",
    "start": "npm run build && npx serve"
  }
}
```
- **Important** : importe toujours depuis le package `"@fuwu-yuan/bgew"` (pas de chemins relatifs dans `node_modules`).
- Pour dév, ajoute `--watch` et recharge à chaud avec un serveur simple.

## Entrées (clavier/souris)
- Normalise (`key.toLowerCase()`) et supporte ZQSD/WASD pour l’international.

## Mobile
- Évite les polices trop grandes; pense à la taille du canvas (ex: 960x540) et un wrapper CSS responsive.
