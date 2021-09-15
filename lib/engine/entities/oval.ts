import {Entity} from "../entity";
import {Body} from "detect-collisions";
import {Circle} from "../../collisionSystem";
import {Board} from "../board";

export class Oval extends Entity {
  private _strokeColor: string = "rgba(0,0,0, 1.0)";
  private _fillColor: string = "rgba(255, 255, 255, 1.0)";
  private _hoverStrokeColor: string = "rgba(0,0,0, 1.0)";
  private _hoverFillColor: string = "rgba(255, 255, 255, 1.0)";
  private _clickStrokeColor: string = "rgba(0,0,0, 1.0)"
  private _clickFillColor: string = "rgba(255, 255, 255, 1.0)"
  private _radiusX: number = 0;
  private _radiusY: number = 0;
  private _clicked: boolean = false;

  /**
   *
   * @param centerX Oval center X
   * @param centerY Oval center Y
   * @param radiusX Orizontal radius
   * @param radiusY Vertical radius
   * @param strokeColor
   * @param fillColor
   * @param hoverStrokeColor
   * @param hoverFillColor
   * @param clickStrokeColor
   * @param clickFillColor
   */
  constructor(centerX: number,
              centerY: number,
              radiusX: number,
              radiusY: number,
              strokeColor: string|null = null,
              fillColor: string|null = null,
              hoverStrokeColor: string|null = null,
              hoverFillColor: string|null = null,
              clickStrokeColor: string|null = null,
              clickFillColor: string|null = null,
              ) {
    super(centerX, centerY, radiusX*2, radiusY*2);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.onMouseEvent("mousedown", this.onMouseDown.bind(this));
    this.onMouseEvent("mouseup", this.onMouseUp.bind(this));
    this.onMouseEvent("mouseenter", this.onMouseEnter.bind(this));
    this.onMouseEvent("mouseleave", this.onMouseLeave.bind(this));
    if (strokeColor) {
      this.strokeColor = strokeColor;
      this.hoverStrokeColor = strokeColor;
      this.clickStrokeColor = strokeColor;
    }
    if (fillColor) {
      this.fillColor = fillColor;
      this.hoverFillColor = fillColor;
      this.clickFillColor = fillColor;
    }
    if (hoverStrokeColor) { this.hoverStrokeColor = hoverStrokeColor; }
    if (hoverFillColor) { this.hoverFillColor = hoverFillColor; }
    if (clickStrokeColor) { this.clickStrokeColor = clickStrokeColor; }
    if (clickFillColor) { this.clickFillColor = clickFillColor; }
  }

  init(board: Board) {
    super.init(board);
    this._body = new Circle(this, this.absX, this.absY, this.radiusX);
  }

  private onMouseDown(event: MouseEvent) {
      this._clicked = true;
  }

  private onMouseUp(event: MouseEvent) {
      this._clicked = false;
  }

  private onMouseEnter(event: MouseEvent) {
      //this.board?.changeCursor("pointer");
  }

  private onMouseLeave(event: MouseEvent) {
      //this.board?.changeCursor("default");
  }

  get clicked() {
    return this._clicked;
  }

  set clicked(clicked: boolean) {
    this._clicked = clicked;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    //set color
    ctx.strokeStyle = this.strokeColor;
    ctx.fillStyle = this.fillColor;
    if (this.clicked) {
      ctx.strokeStyle = this.clickStrokeColor;
      ctx.fillStyle = this.clickFillColor;
    }else if (this.hovered) {
      ctx.strokeStyle = ctx.fillStyle = this.hoverStrokeColor;
      ctx.fillStyle = ctx.fillStyle = this.hoverFillColor;
    }

    //draw oval
    let path = this.getPath2D();
    ctx.fill(path);
    ctx.stroke(path);
  }

  getPath2D(): Path2D {
    let path = new Path2D();
    path.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI*2, false);
    return path;
  }

  update(delta: number): void {
    super.update(delta);
    this._body.x = this.absX;
    this._body.y = this.absY;
    (this._body as Circle).radius = this.radiusX;
  }

  /*********************
   * Getters & Setters *
   *********************/
  get hoverFillColor(): string { return this._hoverFillColor; }
  set hoverFillColor(value: string) { this._hoverFillColor = value; }
  get hoverStrokeColor(): string { return this._hoverStrokeColor; }
  set hoverStrokeColor(value: string) { this._hoverStrokeColor = value; }
  get fillColor(): string { return this._fillColor; }
  set fillColor(value: string) { this._fillColor = value; }
  get strokeColor(): string { return this._strokeColor; }
  set strokeColor(value: string) { this._strokeColor = value; }
  get clickFillColor(): string { return this._clickFillColor; }
  set clickFillColor(value: string) { this._clickFillColor = value; }
  get clickStrokeColor(): string { return this._clickStrokeColor; }
  set clickStrokeColor(value: string) { this._clickStrokeColor = value; }
  get radiusX(): number { return this._radiusX; }
  set radiusX(value: number) { this._radiusX = value; }
  get radiusY(): number { return this._radiusY; }
  set radiusY(value: number) { this._radiusY = value; }
}
