# Network

Le moteur inclut un **NetworkManager** (REST + WebSocket) et une classe abstraite `AbstractNetworkManager` si tu veux brancher ton propre backend.

Interfaces utiles : `Network.Room`, `Network.Response`, `Network.Player`, `Network.SocketMessage`.

## NetworkManager (impl par défaut)
```ts
const net = board.networkManager; // instance par défaut
await net.ping(); // string
const resp = await net.createRoom("Lobby 1", 4, { map:"A" }, true);
await net.setRoomData({ ready:true }, true);
const data = await net.getRoomData();
await net.closeRoom(resp.data.uid, true);
```
Signatures :
- `ping(): Promise<string>`
- `createRoom(name: string, limit=0, data: {}, autojoinroom=true): Promise<Response>`
- `joinRoom(uid: string): Promise<Response>`
- `setRoomData(data: any, merge: boolean=false): Promise<Response>`
- `getRoomData(): Promise<Response>`
- `closeRoom(uid: string, close: boolean=true): Promise<Response>`
- Getters : `apiUrl`, `wsUrl` (URLs par défaut configurées dans l’implémentation).

## Hooks côté GameStep
- `onPlayerJoin(msg: SocketMessage)`, `onPlayerLeave(msg)`, `onConnectionClosed()` — si tu utilises le WS.
