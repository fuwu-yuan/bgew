# Sound & Timer

## Timer
```ts
const t = board.addTimer(1000, () => console.log("1s"), true); // repeat
// Plus tard : t.stop()
```

API `Timer` : `time`, `counter`, `repeat(bool)`, `loop(number)`, `stop()`, `update(delta)`.

## Sound (Howler)
```ts
board.registerSound("blip", "/assets/blip.ogg");
board.playSound("blip");
board.stopSound("blip", true, 400); // fadeout 400ms
```

- `registerSound(name, src|string[], repeat=false, volume=0.5, sprites?) → Sound`
- `playSound(name, repeat?, volume?, sprite?) → id|null`
- `stopSound(name, fadeout=false, fadeDuration=1000, id?)`
- `getSound(name) → Sound`
- Côté `Sound`: `howl`, `play(repeat?, volume?, sprite?)`, `stop(fadeout?, fadeDuration?, id?)`, `mute(muted?, id?)`, `volume(v?, id?)`, `repeat(bool, id?)`.
