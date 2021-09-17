import {Howl} from "howler";

export class Sound {
    private _howl: Howl;

    /**
     *
     * @param name Sound name
     * @param src One or more src (same sound with multiple src formats)
     * @param repeat Ether to repeat of not the sound at the end
     * @param volume Volume to play sound by default (default 0.5)
     * @param sprites Object defining sprites in this sound (optional)
     */
    constructor(name: string, src: string|string[], repeat: boolean = false, volume: number = 0.5, sprites: {[key: string]: [number, number]} = {}) {
        if (!Array.isArray(src)) {
            src = [src];
        }
        this._howl = new Howl({
            src: src,
            autoplay: false,
            loop: repeat,
            volume: volume,
            sprite: sprites,
            onend: () => {}
        });
    }

    /**
     * Play the sound
     *
     * @param repeat Ether to repeat the sound at the end
     * @param volume Optional volume (default 0.5)
     * @param sprite Optional sprite name if your sound is divided by sprites
     * @return id The sound id. Can be used to stop sound
     */
    play(repeat?: boolean, volume?: number, sprite?: string): number {
        let id = this._howl.play(sprite);
        if (typeof repeat !== 'undefined') {
            this.repeat(repeat, id);
        }
        if (typeof volume !== 'undefined') {
            this.volume(volume, id);
        }
        return id;
    }

    /**
     * Stop the current sound
     *
     * @param fadeout Ether to fadeout the sound before stopping it
     * @param fadeDuration The fade duration if fadeout
     * @param id Optional id of the sound
     */
    stop(fadeout: boolean = false, fadeDuration: number = 1000, id?: number) {
        let oldVolume = this._howl.volume();
        this._howl.once("fade", soundId => {
            this._howl.stop(soundId);
            this._howl.volume(oldVolume);
        }, id);
        if (fadeout) {
            this._howl.fade(this._howl.volume(), 0, fadeDuration, id);
        }else {
            this._howl.stop(id);
        }
    }

    /**
     * Mute/Unmute the sound
     *
     * @param mute True to mute, False to unmute
     * @param id Optional sound id
     */
    mute(mute: boolean = true, id?: number) {
        this._howl.mute(mute, id);
    }

    /**
     * Change sound volume
     *
     * @param volume New volume
     * @param id Optional sound id
     */
    volume(volume: number, id?: number) {
        if (id) {
            this._howl.volume(volume, id);
        }else {
            this._howl.volume(volume);
        }
    }

    /**
     * Loop the sound
     *
     * @param repeat Ether to repeat or not the sound at the end
     * @param id Optional sound id
     */
    repeat(repeat: boolean = true, id?: number) {
        this._howl.loop(repeat, id)
    }

    get howl(): Howl {
        return this._howl;
    }

    set howl(value: Howl) {
        this._howl = value;
    }
}
