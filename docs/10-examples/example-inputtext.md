# Inputtext
```ts
const it = new Entities.Inputtext(32, 240, 280, 36, "Pseudo");
it.placeholder = "Tape ton pseudo";
it.onchange((val)=> console.log("value:", val));
board.addEntity(it);
```
