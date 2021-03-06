/**
 * Vector class ported to typescript from winduptoy gist
 * https://gist.github.com/winduptoy/a1aa09c3499e09edbd33
 *
 * Javascript class originaly hacked from evanw's lightgl.js
 * https://github.com/evanw/lightgl.js/blob/master/src/vector.js
 */
export class Vector2D {

    private _x: number;
    private _y: number;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    /* GETTERS / SETTERS */

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    /* INSTANCE METHODS */

    negative() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    add(v: Vector2D|number) {
        if (v instanceof Vector2D) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    }

    subtract(v: Vector2D|number) {
        if (v instanceof Vector2D) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= v;
        }
        return this;
    }

    multiply(v: Vector2D|number) {
        if (v instanceof Vector2D) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    }

    divide(v: Vector2D|number) {
        if (v instanceof Vector2D) {
            if(v.x != 0) this.x /= v.x;
            if(v.y != 0) this.y /= v.y;
        } else {
            if(v != 0) {
                this.x /= v;
                this.y /= v;
            }
        }
        return this;
    }

    equals(v: Vector2D) {
        return this.x == v.x && this.y == v.y;
    }

    dot(v: Vector2D) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vector2D) {
        return this.x * v.y - this.y * v.x
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.divide(this.length());
    }

    min() {
        return Math.min(this.x, this.y);
    }

    max() {
        return Math.max(this.x, this.y);
    }

    toAngles() {
        return -Math.atan2(-this.y, this.x);
    }

    angleTo(a: Vector2D) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    toArray(n: number) {
        return [this.x, this.y].slice(0, n || 2);
    }

    clone() {
        return new Vector2D(this.x, this.y);
    }

    set(x: number, y: number) {
        this.x = x; this.y = y;
        return this;
    }

    /* STATIC METHODS */

    static negative(a: Vector2D) {
        return new Vector2D(-a.x, -a.y);
    }

    static add(a: Vector2D, b: Vector2D|number) {
        if (b instanceof Vector2D) return new Vector2D(a.x + b.x, a.y + b.y);
        else return new Vector2D(a.x + b, a.y + b);
    }

    static subtract(a: Vector2D, b: Vector2D|number) {
        if (b instanceof Vector2D) return new Vector2D(a.x - b.x, a.y - b.y);
        else return new Vector2D(a.x - b, a.y - b);
    }

    static multiply(a: Vector2D, b: Vector2D|number) {
        if (b instanceof Vector2D) return new Vector2D(a.x * b.x, a.y * b.y);
        else return new Vector2D(a.x * b, a.y * b);
    }

    static divide(a: Vector2D, b: Vector2D|number) {
        if (b instanceof Vector2D) return new Vector2D(a.x / b.x, a.y / b.y);
        else return new Vector2D(a.x / b, a.y / b);
    }

    static equals(a: Vector2D, b: Vector2D) {
        return a.x == b.x && a.y == b.y;
    }

    static dot(a: Vector2D, b: Vector2D) {
        return a.x * b.x + a.y * b.y;
    }

    static cross(a: Vector2D, b: Vector2D) {
        return a.x * b.y - a.y * b.x;
    }
}
