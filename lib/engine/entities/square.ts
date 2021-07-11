import {Entity} from "../entity";

export class Square extends Entity {
  private _strokeColor: string = "rgba(0,0,0, 1.0)";
  private _fillColor: string = "rgba(255, 255, 255, 1.0)";
  private _hoverStrokeColor: string = "rgba(0,0,0, 1.0)";
  private _hoverFillColor: string = "rgba(255, 255, 255, 1.0)";
  private _clickStrokeColor: string = "rgba(0,0,0, 1.0)"
  private _clickFillColor: string = "rgba(255, 255, 255, 1.0)"
  private _radius : {tl: number, tr: number, br: number, bl: number} = {tl: 0, tr: 0, br: 0, bl: 0};
  private _clicked: boolean = false;

  constructor(x: number,
              y: number,
              width: number,
              height: number,
              strokeColor: string|null = null,
              fillColor: string|null = null,
              hoverStrokeColor: string|null = null,
              hoverFillColor: string|null = null,
              clickStrokeColor: string|null = null,
              clickFillColor: string|null = null,
              radius: {tl: number, tr: number, br: number, bl: number}|null = null
              ) {
    super(x, y, width, height);
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
    if (radius) { this.radius = radius; }
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
    //super.draw(ctx);
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

    //draw square
    let path = this.getPath2D();
    ctx.fill(path);
    ctx.stroke(path);
  }

  getPath2D(): Path2D {
    let path = new Path2D();
    path.moveTo(this.x + this.radius.tl, this.y);
    path.lineTo(this.x + this.width - this.radius.tr, this.y);
    path.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius.tr);
    path.lineTo(this.x + this.width, this.y + this.height - this.radius.br);
    path.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius.br, this.y + this.height);
    path.lineTo(this.x + this.radius.bl, this.y + this.height);
    path.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius.bl);
    path.lineTo(this.x, this.y + this.radius.tl);
    path.quadraticCurveTo(this.x, this.y, this.x + this.radius.tl, this.y);
    path.closePath();
    return path;
  }

  update(delta: number): void {
    super.update(delta);
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
  get radius(): { tl: number; tr: number; br: number; bl: number } { return this._radius; }
  set radius(value: { tl: number; tr: number; br: number; bl: number }) { this._radius = value; }
}
