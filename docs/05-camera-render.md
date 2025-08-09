# Camera & rendu

- **Camera** : accessible via `gameStep.camera` — propriétés simples `x`, `y`. Le `draw()` par défaut translate la scène en fonction de la caméra.
- **Scale HiDPI** : `new Board(..., enableHIDPI=true)` applique `devicePixelRatio` (méthode utilitaire : `board.getPixelRatio()`).
- **Styles par défaut** : `board.resetStyles()` remet le `ctx` aux valeurs initiales avant chaque entité.
- **Effets** : fais tes translations/rotations par entité (déjà géré par `GameStep.draw` : pivot au centre de l’entité si `rotate` ≠ 0).
