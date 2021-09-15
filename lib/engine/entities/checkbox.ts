import {Rectangle} from "./rectangle";

export class Checkbox extends Rectangle {
    protected _checked = false;
    private _tickLineWidth: number = 5;
    protected _strokeColor: string = "rgba(0,0,0, 0.8)";
    protected _hoverStrokeColor: string = "rgba(0,0,0, 1.0)";
    protected _tickColor: string = "rgba(0,0,0, 1.0)";
    protected _hoverTickColor: string = "rgba(0,0,0, 1.0)";
    protected _clickTickColor: string = "rgba(0,0,0, 1.0)";
    protected _disabledTickColor: string = "rgba(0,0,0, 1.0)";
    protected _disabledFillColor: string = "rgba(150,150,150,1.0)";
    protected _disabledStrokeColor: string = "rgba(0,0,0,1.0)";
    protected _radius : {tl: number, tr: number, br: number, bl: number} = {tl: 5, tr: 5, br: 5, bl: 5};

    constructor(x: number,
               y: number,
               width: number,
               height: number) {
        super(x, y, width, height);
        this.onMouseEvent("click", () => {
           this._checked = !this._checked;
        });
    }


    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        ctx.strokeStyle = this.tickColor;
        if (this.clicked) {
            ctx.strokeStyle = this.clickStrokeColor;
        }else if (this.hovered) {
            ctx.strokeStyle = this.hoverTickColor;
        }

        if (this.disabled) {
            ctx.strokeStyle = this.disabledTickColor;
        }

        //draw tick
        if (this.checked) {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/5, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width / 2,this.y + this.height - this.height/5);
            ctx.lineTo(this.x + this.width - this.width/5,this.y + this.height/5);
            ctx.lineWidth = this.tickLineWidth;
            ctx.stroke();
        }
    }

    get checked(): boolean {
        return this._checked;
    }

    set checked(value: boolean) {
        this._checked = value;
    }

    get tickColor(): string {
        return this._tickColor;
    }

    set tickColor(value: string) {
        this._tickColor = value;
    }

    get hoverTickColor(): string {
        return this._hoverTickColor;
    }

    set hoverTickColor(value: string) {
        this._hoverTickColor = value;
    }

    get clickTickColor(): string {
        return this._clickTickColor;
    }

    set clickTickColor(value: string) {
        this._clickTickColor = value;
    }

    get disabledTickColor(): string {
        return this._disabledTickColor;
    }

    set disabledTickColor(value: string) {
        this._disabledTickColor = value;
    }

    get disabledFillColor(): string {
        return this._disabledFillColor;
    }

    set disabledFillColor(value: string) {
        this._disabledFillColor = value;
    }

    get disabledStrokeColor(): string {
        return this._disabledStrokeColor;
    }

    set disabledStrokeColor(value: string) {
        this._disabledStrokeColor = value;
    }

    get tickLineWidth(): number {
        return this._tickLineWidth;
    }

    set tickLineWidth(value: number) {
        this._tickLineWidth = value;
    }
}
