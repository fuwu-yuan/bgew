import {Entity} from "../entity";
import {Board} from "../board";

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
    //this.board?.changeCursor("pointer");
  }

  private onMouseLeave(event: MouseEvent) {
    //this.board?.changeCursor("default");
  }

  intersect(x: number, y: number, event: MouseEvent, depth = 1): boolean {
    /*return x >= (this.x + this.translate.x) && x <= (this.x + this.translate.x) + this.width &&
      y >= (this.y + this.translate.y) && y <= (this.y + this.translate.y) + this.height;*/
    this.board?.ctx.translate(this.translate.x, this.translate.y);
    // Rotate context from entity center
    this.board?.ctx.translate(this.x + this.width/2, this.y + this.height/2);
    this.board?.ctx.rotate(this.rotate);
    this.board?.ctx.translate((this.x + this.width/2)*-1, (this.y + this.height/2)*-1)

    let result = this.board?.ctx.isPointInPath(this.getPath2D(), x, y) || false;
    if (result) {
      this.board?.ctx.translate(this.x, this.y);
      this.entities.forEach((entity: Entity) => {
        if (entity.disabled) return;
        if (entity.intersect(x, y, event, depth+1)) {
          if (event.type === "mousemove") {
            if (!entity.hovered) {
              entity.hovered = true;
              entity.dispatcher.dispatch("mouseenter", new MouseEvent("mouseenter", event));
            }
          }
          entity.dispatcher.dispatch(event.type, event);
        }else {
          if (event.type === "mousemove") {
            if (entity.hovered) {
              entity.hovered = false;
              entity.dispatcher.dispatch("mouseleave", new MouseEvent("mouseleave", event));
            }
          }
        }
      });
      this.board?.ctx.translate(this.x*-1, this.y*-1);
    }

    // UNDO Rotate context from entity center
    this.board?.ctx.translate(this.x + this.width/2, this.y + this.height/2);
    this.board?.ctx.rotate(this.rotate*-1);
    this.board?.ctx.translate((this.x + this.width/2)*-1, (this.y + this.height/2)*-1)
    // UNDO Translate context
    this.board?.ctx.translate(this.translate.x*-1, this.translate.y*-1);
    return result;
  }

  public addEntity(entity: Entity) {
    if (this.board && !entity.board) {
      entity.board = this.board;
    }
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
        // Reset style
        this.board?.resetStyles();
        // Save context
        ctx.save();
        // Translate context
        ctx.translate(entity.translate.x, entity.translate.y);
        // Rotate context from entity center
        ctx.translate(entity.x + entity.width/2, entity.y + entity.height/2);
        ctx.rotate(entity.rotate);
        ctx.translate((entity.x + entity.width/2)*-1, (entity.y + entity.height/2)*-1)
        // Draw entity
        entity.draw(ctx);
        // Restore context
        ctx.restore();
      }
    });
  }

  update(delta: number): void {
    for (const entity of this.entities) {
      entity.update(delta);
    }
  }

  countEntities() {
    let count = 0;
    count = this.entities.length;
    for (const entity of this.entities) {
      if (entity instanceof Container) {
        count += entity.countEntities();
      }
    }
    return count;
  }

  debug(ctx: CanvasRenderingContext2D) {
    //super.draw(ctx);
    ctx.translate(this.x, this.y);
    this.entities.forEach((entity: Entity) => {
        // Reset style
        this.board?.resetStyles();
        // Save context
        ctx.save();
        // Translate context
        ctx.translate(entity.translate.x, entity.translate.y);
        // Rotate context from entity center
        ctx.translate(entity.x + entity.width/2, entity.y + entity.height/2);
        ctx.rotate(entity.rotate);
        ctx.translate((entity.x + entity.width/2)*-1, (entity.y + entity.height/2)*-1)
        // Draw entity
        if (this.board?.debug.skeleton) {
          this.board.ctx.strokeStyle = "red";
          this.board.ctx.stroke(this.getPath2D());
        }
        // Restore context
        ctx.restore();
    });
  }

  set board(value: Board | null) {
    super.board = value;
    for (const entity of this.entities) {
      entity.board = this.board;
    }
  }


  get board(): Board | null {
    return super.board;
  }

  /*********************
   * Getters & Setters *
   *********************/

  get entities(): Entity[] { return this._entities; }
  set entities(value: Entity[]) { this._entities = value; }
}
