import {Entity} from "../entity";
import {Body} from "detect-collisions";
import {Polygon} from "../../collisionSystem";
import {Board} from "../board";

export class Line extends Entity {
  private _color: string = "rgba(0,0,0, 1.0)";
  private _x1: number;
  private _x2: number;
  private _y1: number;
  private _y2: number;
  private _length: number;

  constructor(x1: number,
              y1: number,
              x2: number,
              y2: number,
              color: string|null = null,
              ) {
    super(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2-x1), Math.abs(y2-y1));
    this._x1 = x1;
    this._x2 = x2;
    this._y1 = y1;
    this._y2 = y2;
    if (color) {
      this._color = color;
    }
    this._length = Math.sqrt(Math.pow(Math.abs(x2-x1), 2) + Math.pow(Math.abs(y2-y1), 2));
  }

  init(board: Board) {
    this.board = board;
    this._body = new Polygon(this, this.parent ? this.parent.absX : 0, this.parent ? this.parent.absY : 0, [[this.x1, this.y1], [this.x2, this.y2]]);
    this.board.collisionSystem.insert(this.body);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.strokeStyle = this.color;
    //draw line
    let path = this.getPath2D();
    ctx.stroke(path);
  }

  getPath2D(): Path2D {
    let path = new Path2D();
    path.moveTo(this.x1, this.y1);
    path.lineTo(this.x2, this.y2);
    path.closePath();
    return path;
  }

  update(delta: number): void {
    super.update(delta);
  }

  /*********************
   * Getters & Setters *
   *********************/

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get x1(): number {
    return this._x1;
  }

  set x1(value: number) {
    this._x1 = value;
  }

  get x2(): number {
    return this._x2;
  }

  set x2(value: number) {
    this._x2 = value;
  }

  get y1(): number {
    return this._y1;
  }

  set y1(value: number) {
    this._y1 = value;
  }

  get y2(): number {
    return this._y2;
  }

  set y2(value: number) {
    this._y2 = value;
  }

  get length(): number {
    return this._length;
  }
}
