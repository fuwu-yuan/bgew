export class Timer {
    private _counter: number = 0;
    private _time: number = 0;
    private _repeat: boolean = true;
    private _cb: () => void;
    private _remove: () => void;
    private _loop: number = 0;

    constructor(time: number, end: () => void, remove: () => void = () => {}) {
        this._time = time;
        this._cb = end;
        this._remove = remove;
    }

    update(delta: number) {
        this._counter += delta;
        if (this._counter >= this._time) {
            this._cb();
            this._counter = 0;
            this._loop++;
            if (!this._repeat) {
                this._remove();
            }
        }
    }

    get counter(): number {
        return this._counter;
    }

    set counter(value: number) {
        this._counter = value;
    }

    get time(): number {
        return this._time;
    }

    set time(value: number) {
        this._time = value;
    }

    get repeat(): boolean {
        return this._repeat;
    }

    set repeat(value: boolean) {
        this._repeat = value;
    }

    get loop(): number {
        return this._loop;
    }

    set loop(value: number) {
        this._loop = value;
    }

    stop() {
        this.repeat = false;
        this._remove();
    }
}
