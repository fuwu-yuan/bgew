export class Camera {
  protected _x: number = 0;
  protected _y: number = 0

  constructor() {
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }
}
