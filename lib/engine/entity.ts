import {Dispatcher} from "../classes/Dispatcher";
import {Board} from "./board";
import {Container} from "./entities";
import {Polygon, Circle, Point} from "../collisionSystem";
import {Body, Result} from "detect-collisions";

/**
 * The most important part of your game
 * To build a game, you need to create entities and add it to your board
 *
 */
export abstract class Entity {
  private static __AI: number = 0;

  private _parent: Container|null = null;
  protected _id: string;
  protected _rotate: number = 0;
  protected _zoom: number = 1;
  protected _x: number;
  protected _y: number;
  private _directionX: number = 0;
  private _directionY: number = 0;
  private _speed: number = 0;
  protected _width: number;
  protected _height: number;
  protected _dispatcher = new Dispatcher();
  protected _board: Board | null = null;
  protected _visible: boolean = true;
  public hovered: boolean = false;
  protected _disabled: boolean = false;
  protected _focus: boolean = false;
  protected _solid: boolean = false;
  protected _weight: number = 0;
  protected _gravitySpeed: number = 0;
  protected _falling: boolean = false;
  protected _body: Body;

  protected constructor(x: number, y: number, width: number, height: number, id: string = "") {
    this._id = id !== "" ? id : ('@entity-'+Entity.__AI++);
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._body = new Point(this);
  }

  init(board: Board) {
    this.board = board;
    this._body = new Polygon(this, this.absX, this.absY, [
      [0, 0],
      [this.absX+this.width, 0],
      [this.absX+this.width, this.absY+this.height],
      [0, this.absY+this.height]
    ]);
  }

  get parent(): Container | null {
    return this._parent;
  }

  set parent(value: Container | null) {
    this._parent = value;
  }

  get board(): Board | null {
    return this._board;
  }

  set board(value: Board | null) {
    this._board = value;
  }

  get rotate(): number {
    return this._rotate;
  }

  set rotate(angle: number) {
    angle = angle * Math.PI / 180
    this._rotate = angle;
  }

  get zoom(): number {
    return this._zoom;
  }

  set zoom(value: number) {
    this._zoom = value;
  }

  get id(): string {
    return this._id;
  }

  /**
   * BE AWARE : if you change entity id after registered event listeners, events will not be triggered anymore for this entity, you will need to remove event listeners and register it again.
   * @param id
   */
  set id(id: string) {
    this._id = id;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
  }

  get speedX(): number {
    return this.speed * this.directionX;
  }

  get speedY(): number {
    return this.speed * this.directionY;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    this._speed = value;
  }

  /**
   * Get directionX in radian
   */
  get directionX(): number {
    return this._directionX;
  }

  /**
   * Set directionX in radian
   * @param value in radian
   */
  set directionX(value: number) {
    this._directionX = value;
  }

  /**
   * Get directionY in radian
   */
  get directionY(): number {
    return this._directionY;
  }

  /**
   * Set directionY in radian
   * @param value in radian
   */
  set directionY(value: number) {
    this._directionY = value;
  }

  /**
   * Get direction in radian<br>
   * To get degrees use {@link Entity.directionDegrees}
   */
  get direction() {
    return Math.atan(this.directionY / this.directionX);
  }

  /**
   * Set direction in radian<br>
   * To use degrees use {@link Entity.directionDegrees}
   * @param value in radian
   */
  set direction(value: number) {
    this.directionX = Math.cos(value);
    this.directionY = Math.sin(value);
  }

  /**
   * Get the direction in degrees
   */
  get directionDegrees() {
    return this.direction * 180 / Math.PI;
  }

  /**
   * Set the direction in degrees
   * @param value in degrees
   */
  set directionDegrees(value: number) {
    this.direction = value / 180 * Math.PI;
  }

  get absX(): number {
    return this.x + (this.parent ? this.parent.absX : 0);
  }

  get absY(): number {
    return this.y + (this.parent ? this.parent.absY : 0);
  }

  get height(): number {
    return this._height*this._zoom;
  }

  set height(value: number) {
    this._height = value;
  }

  get width(): number {
    return this._width*this._zoom;
  }

  set width(value: number) {
    this._width = value;
  }

  get visible(): boolean {
    return this._visible && (!this.parent || this.parent.visible);
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get dispatcher() {
    return this._dispatcher;
  }

  get solid(): boolean {
    return this._solid;
  }

  set solid(value: boolean) {
    this._solid = value;
  }

  get weight(): number {
    return this._weight;
  }

  set weight(value: number) {
    this._weight = value;
  }

  get falling(): boolean {
    return this._falling;
  }

  set falling(value: boolean) {
    this._falling = value;
  }

  intersect(x: number, y: number, event: Event|null = null, depth = 1): boolean {
    // Rotate context from entity center
    this.board?.ctx.translate(this.x + this.width/2, this.y + this.height/2);
    this.board?.ctx.rotate(this.rotate);
    this.board?.ctx.translate((this.x + this.width/2)*-1, (this.y + this.height/2)*-1)

    let result = this.board?.ctx.isPointInPath(this.getPath2D(), x, y) || false;

    // UNDO Rotate context from entity center
    this.board?.ctx.translate(this.x + this.width/2, this.y + this.height/2);
    this.board?.ctx.rotate(this.rotate*-1);
    this.board?.ctx.translate((this.x + this.width/2)*-1, (this.y + this.height/2)*-1)
    return result;
  }

  intersectWithEntity(entity: Entity): boolean {
    /*let thisAbsY = this.absY;
    let thisAbsX = this.absX;
    if (this instanceof Oval) {
      thisAbsY = this.absY - (this as Oval).radiusY;
      thisAbsX = this.absX - (this as Oval).radiusX;
    }

    let otherAbsY = entity.absY;
    let otherAbsX = entity.absX;
    if (entity instanceof Oval) {
      otherAbsY = entity.absY - (entity as Oval).radiusY;
      otherAbsX = entity.absX - (entity as Oval).radiusX;
    }

    return thisAbsX < otherAbsX + entity.width &&
        thisAbsX + this.width > otherAbsX &&
        thisAbsY < otherAbsY + entity.height &&
        this.height + thisAbsY > otherAbsY;*/
    return this.body.collides(entity.body, this.board?.collisionResult);
  }

  /**
   * Check if entity intersect with any of the given entities
   * @param entities Entities to check collision
   * @return An array containing intersecting entities
   */
  public intersectWithEntities(entities: Entity[]): Entity[] {
    let intersect: Entity[] = [];
    if (this.board) {
      for (const entity of entities) {
        if (entity === this) continue;
        if (this.intersectWithEntity(entity)) {
          if (entity instanceof Container) {
            intersect = intersect.concat(this.intersectWithEntities((entity as Container).entities));
          }
          intersect.push(entity);
        }
      }
    }
    return intersect;
  }

  /**
   * Listen mouse event on this entity
   * @param event An event from this list : click, dblclick, contextmenu, mousedown, mouseup, mouseenter, mouseleave, mousemove, all
   * @param callback
   */
  onMouseEvent(event: "click" | "dblclick" | "contextmenu" | "mousedown" | "mouseup" | "mouseenter" | "mouseleave" | "mousemove" | "all", callback: (event: MouseEvent) => void) {
    this.dispatcher.on(event, callback);
  }

  /**
   * Listen mouse event on this entity
   * @param event An event from this list : keyup, keydown, keypress, all
   * @param callback
   */
  onKeyboardEvent(event: "keyup" | "keydown" | "keypress" | "all", callback: (event: KeyboardEvent) => void) {
    this.dispatcher.on(event, callback);
  }

  /**
   * Listen for entity intersect with x and y
   * @param x
   * @param y
   * @param callback
   */
  onIntersect(x: number, y: number, callback: (entity: Entity, point: {x: number, y: number}) => void) {
    this.dispatcher.on(`intersect-${x}-${y}`, callback);
  }

  /**
   * Listen for the two entities intersection
   * @param entity
   * @param callback
   */
  onIntersectWithEntity(entity: Entity, callback: (entity: Entity, collisionWith: Entity, result: Result) => void) {
    this.dispatcher.on(`entityintersect-${entity.id}`, callback);
  }

  onIntersectWithAnyEntity(callback: (entity: Entity, collisionWith: Entity, result: Result) => void) {
    this.dispatcher.on("anyentityintersect", callback);
  }

  getPath2D(): Path2D {
    let path = new Path2D();
    path.rect(this.x, this.y, this.width, this.height);
    path.closePath();

    return path;
  }

  get body() {
    return this._body;
  }

  debug(ctx: CanvasRenderingContext2D) {
    if (this.board) {
      if (this.board.debug.skeleton) {
        this.board.ctx.strokeStyle = "red";
        this.board.ctx.stroke(this.getPath2D());
      }
    }
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.rotate = 0;
    this.zoom = 1;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.board?.debug.collision) {
      ctx.strokeStyle = '#FF0000';
      ctx.beginPath();
      this.board?.collisionSystem.draw(ctx);
      ctx.stroke();
    }
    if (this.board) {
      ctx.scale(this.board.scale, this.board.scale);
    }
  }
  onDestroy(): void {

  }

  private updateGravity(delta: number) {
    /*if (this.board && this.board.gravity > 0 && this._weight > 0) {
      this.falling = true;
      this._gravitySpeed += this.board.gravity;
      this.speedY += this._gravitySpeed;
      if (this.speedY > 0) {
        let willY = this.absY+this.height+(this.speedY*delta/1000)+1
        let willHit = this.board.getEntitiesIn(this.absX+1, willY, this.absX+this.width-1, willY).find((e) => {return e.solid;});
        if (typeof willHit !== 'undefined' && willHit.absY <= this.absY + this.height) {
          this._gravitySpeed = 0;
          this.speed = 0;
          this.y = willHit.y - this.height;
          this.falling = false;
        }
      }
    }*/
  }

  private updateSpeed(delta: number) {
    this.x += this.speedX * delta/1000;
    this.y += this.speedY * delta/1000;
  }

  private checkCollisions(delta: number) {
    if (this.board) {
      for (const event of Object.keys(this.dispatcher.events)) {
        // Intersection with point
        if (event.startsWith("intersect-")) {
          let params = event.split("-");
          let x = parseInt(params[1]);
          let y = parseInt(params[2]);
          if (this.intersect(x, y)) {
            this.dispatcher.dispatch(event, /*entity:*/ this, /*point:*/ {x:x, y:y});
          }

          // Intersection with entity
        }else if (event.startsWith("entityintersect-")) {
          let params = event.split("-");
          let otherEntityId = params.slice(1).join('-');
          if (this.board) {
            let otherEntity = this.board.findEntity(otherEntityId);
            if (typeof otherEntity !== 'undefined') {
              if (this.intersectWithEntity(otherEntity)) {
                this.dispatcher.dispatch(event, /*entity:*/ this, /*collisionWith:*/ otherEntity, /*result:*/ this.board.collisionResult);
              }
            }
          }

          // Intersection with any entity
        }else if (event === "anyentityintersect") {
          const potentials = this.body.potentials();
          for (const body of potentials) {
            if (this.body.collides(body, this.board.collisionResult)) {
              this.dispatcher.dispatch(event, /*entity:*/ this, /*collisionWith:*/ (body as Polygon|Circle|Point).entity, /*result:*/ this.board.collisionResult);
            }
          }
        }
      }
    }
  }

  update(delta: number) {
    this._body.x = this.absX;
    this._body.y = this.absY;
    this.checkCollisions(delta);
    this.updateGravity(delta);
    this.updateSpeed(delta);
  }

  /*********************
   * Getters & Setters *
   *********************/
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) { this._disabled = value; }
  get focus(): boolean { return this._focus; }
  set focus(value: boolean) { this._focus = value; }
  //get path() { return this._path; }
}
