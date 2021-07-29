import {Entity} from "../entity";

export class Image extends Entity {

    protected image: HTMLImageElement;

    constructor(x: number, y: number, height: number, width: number, src: string) {
        super(x, y, height, width);
        this.image = document.createElement("img");
        this.image.src = src;
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        this.board?.ctx.drawImage(this.image, 0, 0, this.width, this.height);
    }
}
