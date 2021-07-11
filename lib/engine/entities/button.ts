import {Entity} from "../entity";

export class Button extends Entity {
  protected _text: string;
  // Normal
  private _strokeColor: string = "rgba(255,255,255, 1.0)";
  private _fillColor: string = "rgba(0, 0, 0, 0.0)";
  private _fontSize: number = 20;
  private _fontColor: string = "rgba(255,255,255, 1.0)";
  // Hover
  private _hoverStrokeColor: string = "";
  private _hoverFillColor: string = "";
  private _hoverFontSize: number = 0;
  private _hoverFontColor: string = "";
  private _hoverCursor: string = "";
  // Click
  private _clickStrokeColor: string = "";
  private _clickFillColor: string = "";
  private _clickFontSize: number = 0;
  private _clickFontColor: string = "";
  private _clicked: boolean = false;
  // Disabled
  private _disabledStrokeColor: string = "";
  private _disabledFillColor: string = "";
  private _disabledFontSize: number = 0;
  private _disabledFontColor: string = "";
  // Other
  private _radius : {tl: number, tr: number, br: number, bl: number} = {tl: 0, tr: 0, br: 0, bl: 0};

  constructor(x: number, y: number, width: number, height: number, text: string = "") {
    super(x, y, width, height);
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

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    //set color
    ctx.strokeStyle = this.strokeColor;
    ctx.fillStyle = this.fillColor;
    if (this.disabled) {
      if (this.disabledStrokeColor !== "") ctx.strokeStyle = this.disabledStrokeColor;
      if (this.disabledFillColor !== "") ctx.fillStyle = this.disabledFillColor;
    }else if (this.clicked) {
      if (this.clickStrokeColor !== "") ctx.strokeStyle = this.clickStrokeColor;
      if (this.clickFillColor !== "") ctx.fillStyle = this.clickFillColor;
    }else if (this.hovered) {
      if (this.hoverStrokeColor !== "") ctx.strokeStyle = this.hoverStrokeColor;
      if (this.hoverFillColor !== "") ctx.fillStyle = this.hoverFillColor;
    }

    //draw button
    ctx.beginPath();
    ctx.moveTo(this.x + this.radius.tl, this.y);
    ctx.lineTo(this.x + this.width - this.radius.tr, this.y);
    ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius.tr);
    ctx.lineTo(this.x + this.width, this.y + this.height - this.radius.br);
    ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius.br, this.y + this.height);
    ctx.lineTo(this.x + this.radius.bl, this.y + this.height);
    ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius.bl);
    ctx.lineTo(this.x, this.y + this.radius.tl);
    ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius.tl, this.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    //ctx.strokeRect(this.x, this.y, this.width, this.height);
    //ctx.fillRect(this.x, this.y, this.width, this.height);

    //text options
    var fontSize = this.fontSize;
    ctx.strokeStyle = this.strokeColor;
    ctx.fillStyle = this.fontColor;
    if (this.disabled) {
      if (this.disabledFontSize > 0) fontSize = this.disabledFontSize;
      if (this.disabledFontColor !== "") ctx.fillStyle = this.disabledFontColor;
    }else if (this.clicked) {
      if (this.clickFontSize > 0) fontSize = this.clickFontSize;
      if (this.clickFontColor !== "") ctx.fillStyle = this.clickFontColor;
    }else if (this.hovered) {
      if (this.hoverFontSize > 0)  fontSize = this.hoverFontSize;
      if (this.hoverFontColor !== "")  ctx.fillStyle = this.hoverFontColor;
    }

    ctx.font = fontSize + "px sans-serif";

    //text position
    let debugFontSize = fontSize - 4;
    var textSize = ctx.measureText(this._text);
    var textX = this.x + (this.width/2) - (textSize.width / 2);
    var textY = this.y + debugFontSize + (this.height/2) - (debugFontSize/2);

    //draw the text
    ctx.fillText(this._text, textX, textY);
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
  get clickFontColor(): string { return this._clickFontColor; }
  set clickFontColor(value: string) { this._clickFontColor = value; }
  get hoverFontColor(): string { return this._hoverFontColor; }
  set hoverFontColor(value: string) { this._hoverFontColor = value; }
  get fontColor(): string { return this._fontColor; }
  set fontColor(value: string) { this._fontColor = value; }
  get fontSize(): number { return this._fontSize; }
  set fontSize(value: number) { this._fontSize = value; }
  get clickFontSize(): number { return this._clickFontSize; }
  set clickFontSize(value: number) { this._clickFontSize = value; }
  get hoverFontSize(): number { return this._hoverFontSize; }
  set hoverFontSize(value: number) { this._hoverFontSize = value; }
  get radius(): { tl: number; tr: number; br: number; bl: number } { return this._radius; }
  set radius(value: { tl: number; tr: number; br: number; bl: number }) { this._radius = value; }
  get hoverCursor(): string { return this._hoverCursor; }
  set hoverCursor(value: string) { this._hoverCursor = value; }
  get disabledStrokeColor(): string { return this._disabledStrokeColor; }
  set disabledStrokeColor(value: string) { this._disabledStrokeColor = value; }
  get disabledFillColor(): string { return this._disabledFillColor; }
  set disabledFillColor(value: string) { this._disabledFillColor = value; }
  get disabledFontSize(): number { return this._disabledFontSize; }
  set disabledFontSize(value: number) { this._disabledFontSize = value; }
  get disabledFontColor(): string { return this._disabledFontColor; }
  set disabledFontColor(value: string) { this._disabledFontColor = value; }
}
