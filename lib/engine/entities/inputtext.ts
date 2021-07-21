import {Button} from "./button";

export class InputText extends Button {
    private _visibleText;
    // Bar
    private _showBar = false;
    private _barTimer = { current: 0, max: 500 };
    private _padding = { left: 5, top: 5, right: 5, bottom: 5 };
    private _barIndex: number;
    // Focus
    private _focusStrokeColor: string = "";
    private _focusFillColor: string = "";
    private _focusFontSize: number = 0;
    private _focusFontColor: string = "";
    // Placeholder
    private _placeholder: string = "";
    private _placeholderFontColor: string = "gray";

    constructor(x: number, y: number, width: number, height: number, text: string = "") {
        super(x, y, width, height, text);
        this._barIndex = text.length;
        this.onKeyboardEvent("keyup", this.onKeyUp.bind(this))
        this._visibleText = text;
    }

    onKeyUp(event: KeyboardEvent) {

        var value = event.key;
        if (value.length === 1) {
            let hiddenLength = this.text.length - this._visibleText.length;
            let insertIndex = this._barIndex + (hiddenLength);
            this.text = this.text.slice(0, insertIndex) + value + this.text.slice(insertIndex);
            this.updateVisibleText();
            if (this._barIndex < this._visibleText.length) {
                this._barIndex += 1;
            }
        } else {
            switch (value) {
                case "Backspace":
                    if (this._barIndex > 0) {
                        let hiddenLength = this.text.length - this._visibleText.length;
                        let deleteIndex = this._barIndex + (hiddenLength);
                        this.text = this.text.slice(0, deleteIndex-1) + this.text.slice(deleteIndex);
                        this.updateVisibleText();
                        if (hiddenLength === 0) {
                            this._barIndex -= 1;
                        }
                    }
                    break;
                case "ArrowRight":
                    if (this._barIndex < this._visibleText.length) {
                        this._barIndex += 1;
                    }else {
                        let hiddenIndex = this.text.indexOf(this._visibleText);
                        if (this._visibleText.length + hiddenIndex < this.text.length) {
                            this._visibleText = this.text.slice(hiddenIndex+1, this._visibleText.length + hiddenIndex + 1);
                        }
                    }
                    break;
                case "ArrowLeft":
                    if (this._barIndex > 0) {
                        this._barIndex -= 1;
                    }else {
                        let hiddenIndex = this.text.indexOf(this._visibleText);
                        if (hiddenIndex > 0) {
                            this._visibleText = this.text.slice(hiddenIndex-1, hiddenIndex + this._visibleText.length - 1);
                        }
                    }
                    break;
            }
        }
    }

    /*private static isCharacterKeyPress(evt: KeyboardEvent) {
        if (typeof evt.which === "undefined") {
            // This is IE, which only fires keypress events for printable keys
            return true;
        } else if (typeof evt.which === "number" && evt.which > 0) {
            // In other browsers except old versions of WebKit, evt.which is
            // only greater than zero if the keypress is a printable key.
            // We need to filter out backspace and ctrl/alt/meta key combinations
            return !evt.ctrlKey && !evt.shiftKey && !evt.metaKey && !evt.altKey && evt.which != 8 && evt.key.length === 1;
        }
        return false;
    }*/


    /**
     * @override
     * @param ctx
     */
    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        //set color
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        if (this.focus) {
            if (this.focusStrokeColor !== "") ctx.strokeStyle = this.focusStrokeColor;
            if (this.focusFillColor !== "") ctx.fillStyle = this.focusFillColor;
        }else if (this.disabled) {
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
        if (this.focus) {
            if (this.focusFontSize > 0) fontSize = this.focusFontSize;
            if (this.focusFontColor !== "") ctx.fillStyle = this.focusFontColor;
        }else if (this.disabled) {
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
        var textX = this.x + this._padding.left;
        var textY = this.y + debugFontSize + (this.height/2) - (debugFontSize/2);

        //draw the text
        if (this.text.length > 0) {
            ctx.fillText(this._visibleText, textX,  textY);
        }else if (!this.focus) {
            ctx.fillStyle = this._placeholderFontColor;
            ctx.fillText(this.placeholder, textX,  textY);
        }
        if (this.focus && this._showBar) {
            let pretext = this.text.slice(0, this._barIndex);
            let barX = textX + ctx.measureText(pretext).width - 1;
            ctx.font = fontSize+3 + "px sans-serif";
            ctx.fillText("|", barX, textY+2);
        }
    }

    /**
     * @override
     * @param delta
     */
    update(delta: number) {
        this._barTimer.current += delta;
        if (this._barTimer.current >= this._barTimer.max) {
            this._barTimer.current = 0;
            this._showBar = !this._showBar;
        }
        if (this.board?.ctx) {
            var fontSize = this.fontSize;
            if (this.focus) {
                if (this.focusFontSize > 0) fontSize = this.focusFontSize;
                if (this.focusFontColor !== "") this.board.ctx.fillStyle = this.focusFontColor;
            }else if (this.disabled) {
                if (this.disabledFontSize > 0) fontSize = this.disabledFontSize;
                if (this.disabledFontColor !== "") this.board.ctx.fillStyle = this.disabledFontColor;
            }else if (this.clicked) {
                if (this.clickFontSize > 0) fontSize = this.clickFontSize;
                if (this.clickFontColor !== "") this.board.ctx.fillStyle = this.clickFontColor;
            }else if (this.hovered) {
                if (this.hoverFontSize > 0)  fontSize = this.hoverFontSize;
                if (this.hoverFontColor !== "")  this.board.ctx.fillStyle = this.hoverFontColor;
            }

            this.board.ctx.font = fontSize + "px sans-serif";
        }
        super.update(delta);
    }

    private updateVisibleText(cutend = false) {
        this._visibleText = this.text;
        if (this.board?.ctx) {
            while (this.board.ctx.measureText(this._visibleText).width + this.padding.left + this.padding.right > this.width) {
                if (cutend) {
                    this._visibleText = this._visibleText.slice(0, -1);
                }else {
                    this._visibleText = this._visibleText.slice(1);
                }
            }
        }
    }

    set text(value: string) {
        super.text = value;
        this.updateVisibleText();
    }

    get text() {
        return super.text;
    }

    /*********************
     * Getters & Setters *
     *********************/

    get showBar(): boolean { return this._showBar; }
    set showBar(value: boolean) { this._showBar = value; }
    get padding(): { top: number; left: number; bottom: number; right: number } { return this._padding; }
    set padding(value: { top: number; left: number; bottom: number; right: number }) { this._padding = value; }
    get focusStrokeColor(): string { return this._focusStrokeColor; }
    set focusStrokeColor(value: string) { this._focusStrokeColor = value; }
    get focusFillColor(): string { return this._focusFillColor; }
    set focusFillColor(value: string) { this._focusFillColor = value; }
    get focusFontSize(): number { return this._focusFontSize; }
    set focusFontSize(value: number) { this._focusFontSize = value; }
    get focusFontColor(): string { return this._focusFontColor; }
    set focusFontColor(value: string) { this._focusFontColor = value; }
    get placeholder(): string { return this._placeholder; }
    set placeholder(value: string) { this._placeholder = value; }
    get placeholderFontColor(): string { return this._placeholderFontColor; }
    set placeholderFontColor(value: string) { this._placeholderFontColor = value; }
}
