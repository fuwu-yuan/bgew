import {Dispatcher} from "../classes/Dispatcher";
import {Board} from "./board";
import {Container} from "./entities";

/**
 * The most important part of your game
 * To build a game, you need to create entities and add it to your board
 *
 */
export abstract class Entity {
  protected _translate: {x: number, y:number} = {x: 0, y:0};
  protected _rotate: number = 0;
  private _zoom: number = 1;
  protected _x: number;
  protected _y: number;
  protected _absX: number;
  protected _absY: number;
  protected _width: number;
  protected _height: number;
  protected _dispatcher = new Dispatcher();
  protected _board: Board | null = null;
  private _visible: boolean = true;
  public hovered: boolean = false;
  private _disabled: boolean = false;
  private _focus: boolean = false;
  //private _path: Path2D;

  constructor(x: number, y: number, width: number, height: number) {
    this._x = x;
    this._y = y;
    this._absX = x;
    this._absY = y;
    this._width = width;
    this._height = height;
  }

  init(board: Board) {
    this.board = board;
  }

  get board(): Board | null {
    return this._board;
  }

  set board(value: Board | null) {
    this._board = value;
  }

  get translate() {
    return this._translate;
  }

  set translate(translate: {x: number, y: number}) {
    this._translate = translate;
    this._updateAbsX();
    this._updateAbsY();
  }

  get rotate(): number {
    return this._rotate;
  }

  set rotate(angle: number) {
    angle = angle * Math.PI / 180
    this._rotate = angle;
  }

  get zoom(): number {
    return this._zoom;
  }

  set zoom(value: number) {
    this._zoom = value;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    this._updateAbsX();
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    this._updateAbsY();
  }

  get absX() {
    return this._absX;
  }

  get absY() {
    return this._absY;
  }

  _updateAbsX(parentAbsX: number = 0) {
    this._absX = this.x + this.translate.x + parentAbsX;
    if (this.board) {
      this._absX *= this.board.scale;
    }
  }

  _updateAbsY(parentAbsY: number = 0) {
    this._absY = this.y + this.translate.y + parentAbsY;
    if (this.board) {
      this._absY *= this.board.scale;
    }
  }

  get height(): number {
    return this._height*this._zoom;
  }

  set height(value: number) {
    this._height = value;
  }

  get width(): number {
    return this._width*this._zoom;
  }

  set width(value: number) {
    this._width = value;
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get dispatcher() {
    return this._dispatcher;
  }

  intersect(x: number, y: number, event: MouseEvent, depth = 1): boolean {
    /*return x >= (this.x + this.translate.x) && x <= (this.x + this.translate.x) + this.width &&
      y >= (this.y + this.translate.y) && y <= (this.y + this.translate.y) + this.height;*/
    this.board?.ctx.translate(this.translate.x, this.translate.y);
    // Rotate context from entity center
    this.board?.ctx.translate(this.x + this.width/2, this.y + this.height/2);
    this.board?.ctx.rotate(this.rotate);
    this.board?.ctx.translate((this.x + this.width/2)*-1, (this.y + this.height/2)*-1)

    let result = this.board?.ctx.isPointInPath(this.getPath2D(), x, y) || false;

    // UNDO Rotate context from entity center
    this.board?.ctx.translate(this.x + this.width/2, this.y + this.height/2);
    this.board?.ctx.rotate(this.rotate*-1);
    this.board?.ctx.translate((this.x + this.width/2)*-1, (this.y + this.height/2)*-1)
    // UNDO Translate context
    this.board?.ctx.translate(this.translate.x*-1, this.translate.y*-1);
    return result;
  }

  intersectWithEntity(entity: Entity): boolean {
    return ((this.x + this.translate.x) < (entity.x + entity.translate.x) + entity.width &&
      (this.x + this.translate.x) + this.width > (entity.x + entity.translate.x) &&
      (this.y + this.translate.y) < (entity.y + entity.translate.y) + entity.height &&
      this.height + (this.y + this.translate.y) > (entity.y + entity.translate.y));
  }

  /**
   * Listen mouse event on this entity
   * @param event An event from this list : click, dblclick, contextmenu, mousedown, mouseup, mouseenter, mouseleave, mousemove, all
   * @param callback
   */
  onMouseEvent(event: "click" | "dblclick" | "contextmenu" | "mousedown" | "mouseup" | "mouseenter" | "mouseleave" | "mousemove" | "all", callback: (event: MouseEvent) => void) {
    this.dispatcher.on(event, callback);
  }

  /**
   * Listen mouse event on this entity
   * @param event An event from this list : keyup, keydown, keypress, all
   * @param callback
   */
  onKeyboardEvent(event: "keyup" | "keydown" | "keypress" | "all", callback: (event: KeyboardEvent) => void) {
    this.dispatcher.on(event, callback);
  }

  getPath2D(): Path2D {
    let path = new Path2D();
    path.rect(this.x, this.y, this.width, this.height);
    path.closePath();

    return path;
  }

  debug(ctx: CanvasRenderingContext2D) {
    if (this.board) {
      if (this.board.debug.skeleton) {
        this.board.ctx.strokeStyle = "red";
        this.board.ctx.stroke(this.getPath2D());
      }
    }
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.rotate = 0;
    this.zoom = 1;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.board) {
      ctx.scale(this.board.scale, this.board.scale);
    }
  }
  onDestroy(): void {

  }

  update(delta: number) {
    this._updateAbsX();
    this._updateAbsY();
  }

  /*********************
   * Getters & Setters *
   *********************/
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) { this._disabled = value; }
  get focus(): boolean { return this._focus; }
  set focus(value: boolean) { this._focus = value; }
  //get path() { return this._path; }
}
