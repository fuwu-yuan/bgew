# Référence API (rapide)

> Cette page rassemble les méthodes publiques les plus utiles. Pour une extraction *ligne-par-ligne* exacte depuis le source, je peux le faire après.

## Board
- `new Board(name, version, width, height, domElement, background?)`
- `addSteps(steps: GameStep[])`
- `step: GameStep` (setter)
- `start() / stop()`
- `addEntity(entity) / removeEntity(entity)`
- `onMouseEvent(type, callback)`

## GameStep
- `onEnter()`
- `onLeave()`
- `update(delta)`
- `render(ctx)`

## Entity (base)
- props: `x, y, width, height, visible, zIndex`
- methods: `update(delta)`, `render(ctx)`

## Container (synthetique)
- `new Container(x?, y?)`
- `add(entity)`, `remove(entity)`, `clear()`
- `children` : liste des enfants
- `setPosition(x,y)`, `setScale(s)`, `setVisible(bool)`

## Network (haut niveau)
- `board.network.createRoom(name, opts)`
- `board.network.joinRoom(name)`
- `room.send(event, payload)`
- `room.on(eventName, handler)`

---

**Besoin d'exactitude ?** Je peux maintenant :
1. Extraire chaque fichier `lib/engine/**` et produire une doc *fonction par fonction* (signatures exactes + commentaires).
2. Ou lister les fichiers concernés pour que tu me dises lesquels prioriser.

Dis-moi ce que tu préfères — en attendant, j'ai généré les pages Markdown prêtes à committer dans `/docs/`.
