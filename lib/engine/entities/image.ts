import {Entity} from "../entity";

export class Image extends Entity {

    protected _image: HTMLImageElement;
    protected _sourceX: number|null;
    protected _sourceY: number|null;
    protected _sourceW: number|null;
    protected _sourceH: number|null;

    constructor(src: string, x: number, y: number, width: number = 0, height: number = 0,
                sourceX: number|null = null, sourceY: number|null = null, sourceW: number|null = null, sourceH: number|null = null) {
        super(x, y, width, height);
        this._sourceX = sourceX;
        this._sourceY = sourceY;
        this._sourceW = sourceW;
        this._sourceH = sourceH;

        this._image = document.createElement("img");
        this._image.src = src;
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        if (this.width === 0 || this.height === 0) {
            ctx.drawImage(this.image, this.x, this.y);
        }else if (this._sourceX === null || this._sourceY === null || this._sourceW === null || this._sourceH === null) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }else {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.image, this._sourceX, this._sourceY, this._sourceW, this._sourceH, this.x, this.y, this.width, this.height);
            ctx.imageSmoothingEnabled = true;
        }
    }

    update(delta: number) {
        super.update(delta);
        if (this.width === 0 || this.height === 0) {
            this.width = this.image.width;
            this.height = this.image.height;
        }
    }

    get image() {
        return this._image;
    }
}
