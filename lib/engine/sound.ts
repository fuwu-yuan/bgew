export class Sound {
    private _name;
    private _audio: HTMLAudioElement;
    private _src: string;
    private _repeat: boolean;
    private _volume: number;

    constructor(name: string, src: string) {
        this._name = name;
        this._src = src;
        this._repeat = false;
        this._volume = 1.0;
        this._audio = new Audio(src);
        this._audio.addEventListener('ended', () => { this.ended(); }, false);
        this._audio.addEventListener("canplaythrough", () => {
            document.body.addEventListener("click", () => {
                this._audio.muted = true;
                this._audio.play();
                this.stop();
                this._audio.muted = false;
            }, {once: true});
        }, {once: true});
    }

    get src(): string {
        return this._src;
    }

    set src(value: string) {
        this._src = value;
    }

    get repeat(): boolean {
        return this._repeat;
    }

    set repeat(value: boolean) {
        this._repeat = value;
    }

    get volume(): number {
        return this._volume;
    }

    set volume(value: number) {
        this._volume = value;
    }

    play(repeat: boolean = false, volume: number = 1) {
        this.repeat = repeat;
        this.volume = volume;
        this._audio.volume = volume;
        this._audio.play();
    }

    stop(fadeOut: boolean = false, fadeTime: number = 1000) {
        if (fadeOut) {
            this.adjustVolume(this._audio, 0, {duration: fadeTime}).then(() => {
                this._audio.pause();
                this._audio.currentTime = 0;
            });
        }else {
            this._audio.pause();
            this._audio.currentTime = 0;
        }
    }

    private ended() {
        this._audio.currentTime = 0;
        if (this.repeat) {
            this.play(this.repeat, this.volume);
        }
    }

    private async adjustVolume(
        element: HTMLMediaElement,
        newVolume: number,
        {
            duration = 1000,
            easing = swing,
            interval = 13,
        }: {
            duration?: number,
            easing?: typeof swing,
            interval?: number,
        } = {},
    ): Promise<void> {
        const originalVolume = element.volume;
        const delta = newVolume - originalVolume;

        if (!delta || !duration || !easing || !interval) {
            element.volume = newVolume;
            return Promise.resolve();
        }

        const ticks = Math.floor(duration / interval);
        let tick = 1;

        return new Promise(resolve => {
            const timer = setInterval(() => {
                element.volume = originalVolume + (
                    easing(tick / ticks) * delta
                );

                if (++tick === ticks + 1) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
    }
}

export function swing(p: number) {
    return 0.5 - Math.cos(p * Math.PI) / 2;
}
