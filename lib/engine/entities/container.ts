import {Entity} from "../entity";

export class Container extends Entity {

  private _clicked: boolean = false;
  private _entities: Entity[] = [];

  constructor(x: number,
              y: number,
              width: number,
              height: number,
              entities: Entity[] = [],
  ) {
    super(x, y, width, height);
    this._entities = entities;
    this.onMouseEvent("mousedown", this.onMouseDown.bind(this));
    this.onMouseEvent("mouseup", this.onMouseUp.bind(this));
    this.onMouseEvent("mouseenter", this.onMouseEnter.bind(this));
    this.onMouseEvent("mouseleave", this.onMouseLeave.bind(this));
  }

  private onMouseDown(event: MouseEvent) {
    this._clicked = true;
  }

  private onMouseUp(event: MouseEvent) {
    this._clicked = false;
  }

  private onMouseEnter(event: MouseEvent) {
    this.board?.changeCursor("pointer");
  }

  private onMouseLeave(event: MouseEvent) {
    this.board?.changeCursor("default");
  }

  public addEntity(entity: Entity) {
    entity.board = this.board;
    this._entities.push(entity);
  }

  public addEntities(entities: Entity[]) {
    for (const entity of entities) {
      this.addEntity(entity);
    }
  }

  public removeEntity(entity: Entity) {
    let index = this._entities.indexOf(entity)
    if (index > -1) {
      this._entities.splice(index, 1);
    }
  }

  public removeEntities(entities: Entity[]) {
    for (const entity of entities) {
      this.removeEntity(entity);
    }
  }

  public clear() {
    this._entities = [];
  }

  get clicked() {
    return this._clicked;
  }

  set clicked(clicked: boolean) {
    this._clicked = clicked;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.x, this.y);
    this.entities.forEach((entity: Entity) => {
      if (entity.visible) {
        this.board?.resetStyles();
        ctx.save();
        ctx.translate(entity.translate.x, entity.translate.y);
        ctx.rotate(entity.rotate);
        entity.draw(ctx);
        ctx.restore();
      }
    });
  }

  update(delta: number): void {
    for (const entity of this.entities) {
      entity.update(delta);
    }
  }


  /*********************
   * Getters & Setters *
   *********************/

  get entities(): Entity[] { return this._entities; }
  set entities(value: Entity[]) { this._entities = value; }
}
