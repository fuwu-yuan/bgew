# Réseau — système create/join room

Le README du moteur mentionne un réseau simplifié pour *create/join room*. citeturn5view0

## Objectifs du module réseau
- Permettre de créer ou rejoindre une salle (room) de jeu multi-joueurs.
- Synchroniser états légers (positions, événements) entre pairs via messages.
- Gérer les événements réseau (player-joined, player-left, message, state-sync).

## Patterns d'utilisation (exemples)
> Ici aussi les méthodes sont exprimées sous forme idiomatique. Si tu veux la doc *signature exacte*, je peux l'extraire fichier-par-fichier.

### Exemple : rejoindre une room / envoyer un message
```ts
// pseudo-API recommandée
board.network.createRoom("maRoom", { maxPlayers: 4 }).then(room => {
  room.on('player-joined', (player) => console.log('join', player));
  room.on('message', (msg) => console.log('msg', msg));
});

// ou rejoindre
board.network.joinRoom("maRoom").then(room => {
  room.send('chat', { text: 'salut' });
});

// sync basique d'entité
board.network.on('state-update', (state) => {
  // appliquer état reçu sur entités locales
});
```

## Conseils pour l'intégration réseau
- **Authoritative server vs peer-to-peer** : privilégier un serveur si logique de jeu sensible (éviter triche).
- **Delta-sync** : n'envoyer que les changements (position, animation frame) et pas l'objet complet chaque frame.
- **Interpolation client** : appliquer interpolation pour smoothing côté client lors des mises à jour réseau.
- **Serialisation** : définir un petit DTO (id, x, y, vx, vy, frame) pour chaque entité synchronisée.

### Exemple inspiré d'un jeu multi (pattern)
`Kobbo Online` est un jeu de cartes en ligne basé sur BGEW (voir repo). Il illustre un usage réseau pour synchroniser actions de joueurs et états de parties. citeturn1view2
