# Input & Events (Dispatcher)

Chaque `Board` et chaque `Entity` embarque un **Dispatcher**.

## Souris
```ts
entity.onMouseEvent("click", (evt, x, y) => { /* ... */ });
board.onMouseEvent("mousemove", (evt, x, y) => { /* HUD */ });
```

Types : `"click" | "dblclick" | "contextmenu" | "mousedown" | "mouseup" | "mouseenter" | "mouseleave" | "mousemove" | "all"`.

## Clavier
```ts
board.onKeyboardEvent("keydown", (evt) => {
  if (evt.key === "Escape") board.pause();
});
```

Types : `"keyup" | "keydown" | "keypress" | "all"`.

## Intersections
```ts
player.onIntersectWithEntity(exit, (self, other, result) => { /* ... */ });
player.onIntersectWithAnyEntity((self, other, result) => { /* pickup / collisions */ });
```

`result` provient de `detect-collisions` (`Result`), utile pour du *nudging* (résolution simple des chevauchements).

## Dispatcher (bas niveau)
- `dispatch(eventName, ...args)`
- `on(eventName, callback, { once?: boolean })`
- `off(eventName, callback)`
- `events: { [name]: DispatcherEvent }`
