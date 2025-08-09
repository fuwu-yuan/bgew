# Network — Recettes

## Créer/Rejoindre une room (REST)
```ts
const net = board.networkManager;
const created = await net.createRoom("Lobby #1", 4, { map:"A" }, true);
console.log("Room:", created.data.uid);

await net.setRoomData({ ready: true }, true);
const roomData = await net.getRoomData();
console.log("data:", roomData.data);
```

## WebSocket — hooks dans un GameStep
```ts
import {GameStep} from "@fuwu-yuan/bgew";
export class OnlineStep extends GameStep {
  name = "online";
  onPlayerJoin(msg){ console.log("join:", msg); }
  onPlayerLeave(msg){ console.log("leave:", msg); }
  onConnectionClosed(){ /* retour menu */ }
}
```

## Sync simple de positions (idée)
- Côté host : envoie périodiquement la position (`x,y`) aux clients.
- Côté clients : interpole vers la dernière position reçue pour lisser.
