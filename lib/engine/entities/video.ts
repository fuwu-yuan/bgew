import {Image} from "./image";

export class Video extends Image {
    constructor(src: string, x: number, y: number, width: number = 0, height: number = 0,
                sourceX: number|null = null, sourceY: number|null = null, sourceW: number|null = null,
                sourceH: number|null = null) {
        super(src, x, y, width, height, sourceX, sourceY, sourceW, sourceH, true);
    }

    mute(muted: boolean = true) {
        (this._image as HTMLVideoElement).muted = muted;
    }
}
