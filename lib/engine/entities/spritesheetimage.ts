import {Image} from "./image";

export class SpriteSheetImage extends Image {

    private speedTimer = 0;
    private _animations : Animation[] = [];
    private _currentAnimation: Animation|null = null;
    protected _currentAnimationFrameIndex = 0;

    private _pause: boolean = false;

    private _spriteSheetWidth: number = 0;
    private _spriteSheetHeight: number = 0;

    private _spritesCountX: number;
    private _spritesCountY: number;

    private _spriteX: number = 0;
    private _spriteY: number = 0;

    private _spritePaddingX: number = 0;
    private _spritePaddingY: number = 0;

    constructor(src: string, spritesCountX: number, spritesCountY: number,
                x: number, y: number, width: number, height: number,
                defaultSpritePosition: {x: number, y: number} = {x: 0, y: 0}) {
        super(src, x, y, width, height);
        this._spritesCountX = spritesCountX;
        this._spritesCountY = spritesCountY;
        this._spriteX = defaultSpritePosition.x;
        this._spriteY = defaultSpritePosition.y;
    }

    update(delta: number) {
        super.update(delta);
        if (this._spriteSheetWidth === 0 || this._spriteSheetHeight === 0) {
            this._spriteSheetWidth = this.image.width;
            this._spriteSheetHeight = this.image.height;
            this._sourceW = (this._spriteSheetWidth - (this._spritePaddingX * (this._spritesCountX+1))) / this._spritesCountX;
            this._sourceH = (this._spriteSheetHeight - (this._spritePaddingY * (this._spritesCountY+1))) / this._spritesCountY;
        }

        if (this._sourceW && this._sourceH) {
            this._sourceX = this._spriteX * (this._sourceW + this._spritePaddingX) + this._spritePaddingX
            this._sourceY = this._spriteY * (this._sourceH + this._spritePaddingY) + this._spritePaddingY;
        }

        if (this.currentAnimation && !this.pause) {
            if (this.speedTimer === 0 || this.speedTimer >= this.currentAnimation.speed/this.currentAnimation.frames.length) {
                this.nextFrame();
                this.speedTimer = 0;
            }
            this.speedTimer += delta;
        }
    }

    private nextFrame() {
        if (this.currentAnimation) {
            this._spriteX = this.currentAnimation.frames[this._currentAnimationFrameIndex].x;
            this._spriteY = this.currentAnimation.frames[this._currentAnimationFrameIndex].y;
            this._currentAnimationFrameIndex++;
            if (this._currentAnimationFrameIndex > this.currentAnimation.frames.length-1) {
                this._currentAnimationFrameIndex = 0;
            }
        }
    }

    /**
     * Animate the spritesheet with the registered animation
     * To register an animation see {@link SpriteSheetImage.addAnimation}
     * @param name
     * @param speed
     */
    animate(name: string, speed: number|null = null): Animation|null {
        this._currentAnimationFrameIndex = 0;
        this._currentAnimation = null;
        let animation = this._animations.find((a) => {
            return a.name === name;
        });
        if (animation) {
            this._currentAnimation = animation;
            if (speed) this._currentAnimation.speed = speed;
            this.nextFrame();
        }
        return this._currentAnimation;
    }

    /**
     * Register a new animation
     * Animation can be started by calling {@link SpriteSheetImage.animate} with the animation name
     *
     * @param name
     * @param fromSpriteY
     * @param fromSpriteX
     * @param toSpriteY
     * @param toSpriteX
     * @param speed
     */
    addAnimation(name: string, fromSpriteY: number, fromSpriteX: number, toSpriteY: number, toSpriteX: number, speed: number) {
        let frames: Frame[] = [];
        for (let y = fromSpriteY; y <= toSpriteY; y++) {
            let x = fromSpriteX;
            let maxX = toSpriteX;
            if (y > fromSpriteY) {
                x = 0;
            }
            if (y < toSpriteY) {
                maxX = this._spritesCountX - 1;
            }
            while (x <= maxX) {
                frames.push({y: y, x: x})
                x++;
            }
        }
        this._animations.push({
            name: name,
            speed: speed,
            frames: frames
        });
    }

    /**
     * @param name Name of the animation to remove
     * @return Index of removed animation
     */
    removeAnimation(name: string): number {
        let i = this.animations.findIndex((a) => {
            return a.name === name;
        });
        if (i > -1) {
            this.animations.splice(i, 1);
        }
        return -1;
    }


    get animations(): Animation[] {
        return this._animations;
    }

    get currentAnimation(): Animation | null {
        return this._currentAnimation;
    }

    get pause(): boolean {
        return this._pause;
    }

    set pause(value: boolean) {
        this._pause = value;
    }

    get spritePaddingX(): number {
        return this._spritePaddingX;
    }

    set spritePaddingX(value: number) {
        this._spritePaddingX = value;
        this._sourceW = (this._spriteSheetWidth - (this._spritePaddingX * (this._spritesCountX+1))) / this._spritesCountX;
    }

    get spritePaddingY(): number {
        return this._spritePaddingY;
    }

    set spritePaddingY(value: number) {
        this._spritePaddingY = value;
        this._sourceH = (this._spriteSheetHeight - (this._spritePaddingY * (this._spritesCountY+1))) / this._spritesCountY;
    }

    get spriteX(): number {
        return this._spriteX;
    }

    set spriteX(value: number) {
        this._spriteX = value;
    }

    get spriteY(): number {
        return this._spriteY;
    }

    set spriteY(value: number) {
        this._spriteY = value;
    }
}

export interface Animation {
    name: string;
    frames: Frame[];
    speed: number;
}

export interface Frame {
    x: number;
    y: number;
}
