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

  init(board: Board) {
    super.init(board);
    for (const entity of this.entities) {
      entity.init(board);
    }
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

  intersect(x: number, y: number, event: Event|null = null, depth = 1): boolean {
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
          if (event && event.type === "mousemove") {
            if (!entity.hovered) {
              entity.hovered = true;
              entity.dispatcher.dispatch("mouseenter", new MouseEvent("mouseenter", event));
            }
          }
          if (event && event.type === "click") {
            if (!entity.focus) {
              entity.focus = true;
            }
          }
          if (event) {
            entity.dispatcher.dispatch(event.type, event);
          }
        }else {
          if (event && event.type === "mousemove") {
            if (entity.hovered) {
              entity.hovered = false;
              entity.dispatcher.dispatch("mouseleave", new MouseEvent("mouseleave", event));
            }
          }
          if (event && event.type === "click") {
            if (entity.focus) {
              entity.focus = false;
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
    return result;
  }

  public addEntity(entity: Entity) {
    if (this.board && !entity.board) {
      entity.init(this.board);
    }
    entity.parent = this;
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
      if (this.entities[index] instanceof Container) {
        (this.entities[index] as Container).removeEntities((this.entities[index] as Container).entities);
      }
      this._entities.splice(index, 1);
    }
    this.board?.collisionSystem.remove(entity.body);
  }

  public removeEntities(entities: Entity[]) {
    for (const entity of entities) {
      this.removeEntity(entity);
    }
  }

  getEntitiesIn(x1: number, y1: number, x2: number, y2: number) {
    let entities: Entity[] = [];
    for (const entity of this.entities) {
      if (entity instanceof Container) {
        entities = entities.concat((entity as Container).getEntitiesIn(x1, y1, x2, y2));
      }else if (entity.absX < x2 &&
          entity.absX + entity.width > x1 &&
          entity.absY < y2 &&
          entity.height + entity.absY > y1) {
        entities.push(entity);
      }
    }
    return entities;
  }

  /**
   * Find an entity by id
   * @param id
   * @param recursive search recursively in entity that can contains other entities (like Entities.Container)
   * @return Entity found entity with the given id or undefined if not found
   */
  findEntity(id: string, recursive = false): Entity|undefined {
    let entity = this.entities.find((entity) => {
      return entity.id === id;
    });
    if (typeof entity === "undefined" && recursive) {
      for (const e of this.entities) {
        if (e instanceof Container) {
          entity = e.findEntity(id, recursive);
          if (typeof entity !== 'undefined')
            break;
        }
      }
    }
    return entity;
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
    if (this.board) {
      ctx.translate(this.x * this.board.scale, this.y * this.board.scale);
    }
    this.entities.forEach((entity: Entity) => {
      if (entity.visible && this.board) {
        // Reset style
        this.board.resetStyles();
        // Save context
        ctx.save();
        // Rotate context from entity center
        if (entity.rotate !== 0) {
          ctx.translate(entity.x * this.board.scale + entity.width * this.board.scale / 2, entity.y * this.board.scale + entity.height * this.board.scale / 2);
          ctx.rotate(entity.rotate);
          ctx.translate((entity.x * this.board.scale + entity.width * this.board.scale / 2) * -1, (entity.y * this.board.scale + entity.height * this.board.scale / 2) * -1);
        }
        // Draw entity
        entity.draw(ctx);
        // Restore context
        ctx.restore();
      }
    });
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

  set board(value: Board | null) {
    super.board = value;
    for (const entity of this.entities) {
      if (this.board && !entity.board) {
        entity.board = this.board;
        this.board.collisionSystem.insert(entity.body);
      }
    }
  }

  get board(): Board | null {
    return super.board;
  }

  update(delta: number): void {
    super.update(delta);
    for (const entity of this.entities) {
      entity.update(delta);
    }
  }

  checkCollisions(): void {
    super.checkCollisions();
    for (const entity of this.entities) {
      entity.checkCollisions();
    }
  }

  /*********************
   * Getters & Setters *
   *********************/

  get entities(): Entity[] { return this._entities; }
  set entities(value: Entity[]) { this._entities = value; }

}
