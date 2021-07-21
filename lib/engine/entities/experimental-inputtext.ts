import {Board} from "../board";
import {Entity} from "../entity";

export class ExperimentalInputtext extends Entity {
    // Padding
    private _padding: { top: number; right: number; bottom: number; left: number } = { top: 2, left: 0, right: 0, bottom: 2 }
    // Normal
    private _strokeColor: string = "rgba(255,255,255, 1.0)";
    private _fillColor: string = "rgba(0, 0, 0, 0.0)";
    private _fontSize: number = 20;
    private _fontColor: string = "rgba(255,255,255, 1.0)";
    // Focus
    private _focusStrokeColor: string = "";
    private _focusFillColor: string = "";
    private _focusFontSize: number = 0;
    private _focusFontColor: string = "";
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
    // Placeholder
    private _placeholderFontColor: string = "gray";
    // Other
    private _radius : {tl: number, tr: number, br: number, bl: number} = {tl: 0, tr: 0, br: 0, bl: 0};
    // Real Input
    private _input: HTMLInputElement;

    constructor(x: number, y: number, width: number, height: number, text: string = "") {
        super(x, y, width, height);
        this._input = this.createInput(text);
        for (const event of ["onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onclick", "ondblclick"]) {
            // @ts-ignore
            this._input[event] = (evt: MouseEvent) => {
                this.dispatcher.dispatch(evt.type, evt);
            };
        }
    }

    private createInput(text: string) {
        let input = document.createElement("input");
        input.style.position = "absolute";
        input.style.width = this.width-2 + "px";
        input.style.height = this.height-2 + "px";
        input.style.background = "transparent";
        input.style.margin = "0";
        input.style.padding = "0";
        input.className = "generated-input";
        input.value = text;
        return input;
    }

    init(board: Board) {
        super.init(board);
        board.gameHTMLElement.append(this._input);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
    }

    onDestroy() {
        super.onDestroy();
        this.board?.gameHTMLElement.removeChild(this._input);
    }

    update(delta: number) {
        super.update(delta);

        if (this.board) {
            this._input.style.left = this.x*this.board.scale-1+"px";
            this._input.style.top = this.y*this.board.scale-1+"px";
            this._input.style.width = this.width*this.board.scale-2 + "px";
            this._input.style.height = this.height*this.board.scale-2 + "px";

            this._input.style.border = `solid ${this.board.scale}px ${this._strokeColor}`;
            this._input.style.background = this._fillColor;
            this._input.style.fontSize = this._fontSize*this.board.scale + "px";
            this._input.style.color = this._fontColor;

            this._input.style.padding = `${this._padding.top*this.board.scale}px ${this._padding.right*this.board.scale}px ${this._padding.bottom*this.board.scale}px ${this._padding.left*this.board.scale}px`;
        }

        //TODO Focus / Hover / Click / Disabled
    }

    set text(value: string) {
        this._input.value = value;
    }

    get text() {
        return this._input.value;
    }

    get placeholder(): string {
        return this._input.placeholder;
    }
    set placeholder(value: string) {
        this._input.placeholder = value;
    }

    /*********************
     * Getters & Setters *
     *********************/

    get padding(): { top: number; left: number; bottom: number; right: number } { return this._padding; }
    set padding(value: { top: number; right: number; bottom: number; left: number }) { this._padding = value; }

    get focusStrokeColor(): string { return this._focusStrokeColor; }
    set focusStrokeColor(value: string) { this._focusStrokeColor = value; }
    get focusFillColor(): string { return this._focusFillColor; }
    set focusFillColor(value: string) { this._focusFillColor = value; }
    get focusFontSize(): number { return this._focusFontSize; }
    set focusFontSize(value: number) { this._focusFontSize = value; }
    get focusFontColor(): string { return this._focusFontColor; }
    set focusFontColor(value: string) { this._focusFontColor = value; }

    get hoverFillColor(): string { return this._hoverFillColor; }
    set hoverFillColor(value: string) { this._hoverFillColor = value; }
    get hoverStrokeColor(): string { return this._hoverStrokeColor; }
    set hoverStrokeColor(value: string) { this._hoverStrokeColor = value; }
    get hoverFontColor(): string { return this._hoverFontColor; }
    set hoverFontColor(value: string) { this._hoverFontColor = value; }
    get hoverFontSize(): number { return this._hoverFontSize; }
    set hoverFontSize(value: number) { this._hoverFontSize = value; }
    get hoverCursor(): string { return this._hoverCursor; }
    set hoverCursor(value: string) { this._hoverCursor = value; }

    get fillColor(): string { return this._fillColor; }
    set fillColor(value: string) { this._fillColor = value; }
    get strokeColor(): string { return this._strokeColor; }
    set strokeColor(value: string) { this._strokeColor = value; }
    get fontColor(): string { return this._fontColor; }
    set fontColor(value: string) { this._fontColor = value; }
    get fontSize(): number { return this._fontSize; }
    set fontSize(value: number) { this._fontSize = value; }

    get clickFillColor(): string { return this._clickFillColor; }
    set clickFillColor(value: string) { this._clickFillColor = value; }
    get clickStrokeColor(): string { return this._clickStrokeColor; }
    set clickStrokeColor(value: string) { this._clickStrokeColor = value; }
    get clickFontColor(): string { return this._clickFontColor; }
    set clickFontColor(value: string) { this._clickFontColor = value; }
    get clickFontSize(): number { return this._clickFontSize; }
    set clickFontSize(value: number) { this._clickFontSize = value; }

    get disabledStrokeColor(): string { return this._disabledStrokeColor; }
    set disabledStrokeColor(value: string) { this._disabledStrokeColor = value; }
    get disabledFillColor(): string { return this._disabledFillColor; }
    set disabledFillColor(value: string) { this._disabledFillColor = value; }
    get disabledFontSize(): number { return this._disabledFontSize; }
    set disabledFontSize(value: number) { this._disabledFontSize = value; }
    get disabledFontColor(): string { return this._disabledFontColor; }
    set disabledFontColor(value: string) { this._disabledFontColor = value; }

    get radius(): { tl: number; tr: number; br: number; bl: number } { return this._radius;}
    set radius(value: { tl: number; tr: number; br: number; bl: number }) {
        this._radius = value;
        this._input.style.borderRadius = `${value.tl}px ${value.tr}px ${value.br}px ${value.bl}px`;
    }

    get placeholderFontColor(): string { return this._placeholderFontColor; }
    set placeholderFontColor(value: string) { this._placeholderFontColor = value; }
}
