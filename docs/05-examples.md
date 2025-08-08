# Exemples observés

J'ai consulté les trois jeux que tu m'as indiqué pour m'imprégner des patterns utilisés :

- **Particles** — démo particle / effets (Angular app intégrant BGEW). citeturn1view1
- **Kobbo Online** — jeu de cartes en ligne : bon exemple d'intégration réseau et gestion d'états de partie. citeturn1view2
- **Tower of Hanoi** — exemple fourni dans le repo `bgew/examples` (pattern multi-step, entities & UI). citeturn2view2 citeturn8view0

### Patterns récurrents
- préchargement des assets avant `board.start()`,
- découpage par `GameStep` (menu / jeu / écran de fin),
- utilisation de `Container` pour grouper UI & pièces de jeu,
- network: rooms pour gérer parties / sessions, dispatchers pour events.

> Si tu veux que j'extraie extraits concrets (lignes de code montrant `container.add(...)` ou `network.joinRoom(...)`) depuis ces repos, je peux le faire pas à pas — dis-moi si tu préfères que je scrappe chaque repo fichier-par-fichier.
