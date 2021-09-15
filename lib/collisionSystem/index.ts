import {Circle as CircleBase, Polygon as PolygonBase, Point as PointBase} from "detect-collisions";
import {Entity} from "../engine/entity";

export class Circle extends CircleBase {
    private _entity?: Entity;

    constructor(
        entity: Entity,
        x?: number,
        y?: number,
        radius?: number,
        scale?: number,
        padding?: number
    ) {
        super(x, y, radius, scale, padding)
        this.entity = entity;
    }

    get entity() {
        return this._entity;
    }

    set entity(value) {
        this._entity = value;
    }
}
export class Point extends PointBase {
    private _entity?: Entity;

    constructor(entity: Entity, x?: number, y?: number, padding?: number) {
        super(x, y, padding);
        this.entity = entity;
    }

    get entity() {
        return this._entity;
    }

    set entity(value) {
        this._entity = value;
    }
}
export class Polygon extends PolygonBase {
    private _entity?: Entity;

    constructor(
        entity: Entity,
        x?: number,
        y?: number,
        points?: number[][],
        angle?: number,
        scale_x?: number,
        scale_y?: number,
        padding?: number
    ) {
        super(x, y, points, angle, scale_x, scale_y, padding);
        this.entity = entity;
    }

    get entity() {
        return this._entity;
    }

    set entity(value) {
        this._entity = value;
    }
}
