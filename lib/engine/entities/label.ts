import {Entity} from "../entity";

export class Label extends Entity {

  private _text: string;
  private _fontSize: number = 20;
  private _hoverFontSize: number = 0;
  private _clickFontSize: number = 0;
  private _fontColor: string = "rgba(255,255,255, 1.0)";
  private _hoverFontColor: string = "";
  private _hoverCursor: string = "";
  private ctx: CanvasRenderingContext2D;
  private _clickFontColor: string = "";
  private _clicked: boolean = false;

  constructor(x: number, y: number, text: string, ctx: CanvasRenderingContext2D) {

    super(x, y, 0, 0);
    this.ctx = ctx;
    this.onMouseEvent("mousedown", this.onMouseDown.bind(this));
    this.onMouseEvent("mouseup", this.onMouseUp.bind(this));
    this.onMouseEvent("mouseenter", this.onMouseEnter.bind(this));
    this.onMouseEvent("mouseleave", this.onMouseLeave.bind(this));
    this._text = text;
  }

  private onMouseDown( event: MouseEvent) {
    this._clicked = true;
  }

  private onMouseUp(event: MouseEvent) {
    this._clicked = false;
  }

  private onMouseEnter(event: MouseEvent) {
    if (this._hoverCursor !== "") this.board?.changeCursor(this._hoverCursor);
  }

  private onMouseLeave(event: MouseEvent) {
    if (this._hoverCursor !== "") this.board?.restoreCursor();
  }

  get clicked() {
    return this._clicked;
  }

  set clicked(clicked: boolean) {
    this._clicked = clicked;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    //text options
    var fontSize = this.fontSize;
    ctx.fillStyle = this.fontColor;
    if (this.clicked) {
      if (this.clickFontSize > 0) fontSize = this.clickFontSize;
      if (this.clickFontColor !== "") ctx.fillStyle = this.clickFontColor;
    }else if (this.hovered) {
      if (this.hoverFontSize > 0) fontSize = this.hoverFontSize;
      if (this.hoverFontColor !== "") ctx.fillStyle = this.hoverFontColor;
    }

    ctx.font = fontSize + "px sans-serif";

    //text position
    var textX = this.x;
    var textY = this.y + fontSize;

    let lines: string[] = this._text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      //draw the text
      ctx.fillText(lines[i], textX, textY + (i*fontSize));
    }
  }

  get height() {
    let lines: string[] = this._text.split("\n");
    return lines.length*this.fontSize;
  }

  set height(height: number) {
    this._height = height;
  }

  get width() {
    let width = 0;
    this.ctx.font = this.fontSize + "px sans-serif";
    let lines: string[] = this._text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let tmp = this.ctx.measureText(this._text).width;
      if (tmp > width) width = tmp;
    }
    return width;
  }

  set width(width: number) {
    this._width = width;
  }

  update(delta: number): void {
    super.update(delta);
  }

  /*********************
   * Getters & Setters *
   *********************/
  get text(): string { return this._text; }
  set text(value: string) { this._text = value; }
  get clickFontColor(): string { return this._clickFontColor; }
  set clickFontColor(value: string) { this._clickFontColor = value; }
  get hoverFontColor(): string { return this._hoverFontColor; }
  set hoverFontColor(value: string) { this._hoverFontColor = value; }
  get fontColor(): string { return this._fontColor; }
  set fontColor(value: string) { this._fontColor = value; }
  get fontSize(): number { return this._fontSize; }
  set fontSize(value: number) { this._fontSize = value; this._hoverFontSize = value; }
  get clickFontSize(): number { return this._clickFontSize; }
  set clickFontSize(value: number) { this._clickFontSize = value; }
  get hoverFontSize(): number { return this._hoverFontSize; }
  set hoverFontSize(value: number) { this._hoverFontSize = value; }
  get hoverCursor(): string { return this._hoverCursor; }
  set hoverCursor(value: string) { this._hoverCursor = value; }
}
