import {Dispatcher, DispatcherOptions} from "../classes/Dispatcher";
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
  //private _directionX: number = 0;
  //private _directionY: number = 0;
  //private _speed: number = 0;
  private _speedX: number = 0;
  private _speedY: number = 0;
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
  protected _falling: boolean = true;
  protected _body: Body;
  protected _opacity: number = 1;

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
      [this.width, 0],
      [this.width, this.height],
      [0, +this.height]
    ]);
    if (this.board?.collisionSystem) {
      this.board.collisionSystem.insert(this.body);
    }
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

  /*get speedX(): number {
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
  }*/

  /**
   * Get directionX in radian
   */
  /*get directionX(): number {
    return this._directionX;
  }*/

  /**
   * Set directionX in radian
   * @param value in radian
   */
  /*set directionX(value: number) {
    this._directionX = value;
  }*/

  /**
   * Get directionY in radian
   */
  /*get directionY(): number {
    return this._directionY;
  }*/

  /**
   * Set directionY in radian
   * @param value in radian
   */
  /*set directionY(value: number) {
    this._directionY = value;
  }*/

  /**
   * Get direction in radian<br>
   * To get degrees use {@link Entity.directionDegrees}
   */
  /*get direction() {
    return Math.atan(this.directionY / this.directionX);
  }*/

  /**
   * Set direction in radian<br>
   * To use degrees use {@link Entity.directionDegrees}
   * @param value in radian
   */
  /*set direction(value: number) {
    this.directionX = Math.cos(value);
    this.directionY = Math.sin(value);
  }*/

  /**
   * Get the direction in degrees
   */
  /*get directionDegrees() {
    return this.direction * 180 / Math.PI;
  }*/

  /**
   * Set the direction in degrees
   * @param value in degrees
   */
  /*set directionDegrees(value: number) {
    this.direction = value / 180 * Math.PI;
  }*/

  /**
   * Get entity speedX
   */
  get speedX(): number {
    return this._speedX;
  }

  /**
   * Set entity speedX
   * @param value
   */
  set speedX(value: number) {
    this._speedX = value;
  }

  /**
   * Get entity speedY
   */
  get speedY(): number {
    return this._speedY;
  }

  /**
   * Set entity speedY
   * @param value
   */
  set speedY(value: number) {
    this._speedY = value;
  }

  /**
   *
   * Set entity speed in specified angle in radian or degrees
   *
   * @param speed in pixel per seconds
   * @param angle in radian or degrees
   * @param degrees true if angle is in degrees (default: radian)
   */
  setSpeedWithAngle(speed: number, angle: number, degrees: boolean = false) {
    if (degrees) {
      angle = angle / 180 * Math.PI;
    }
    this._speedX = speed * Math.cos(angle);
    this._speedY = -speed * Math.sin(angle);
  }

  /**
   * Set entity speed keeping current angle (default angle : atan2(-0, 0) = 0 rad)
   * @param value
   */
  set speed(value: number) {
    this.setSpeedWithAngle(value, this.angle);
  }

  /**
   * Get current speed (depending on speedX and speedY)
   */
  get speed() {
    return Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY)
  }

  /**
   * Get current angle in radian (depending on speedX and speedY). Default angle : atan2(-0, 0) = 0 rad
   */
  get angle() {
    return Math.atan2(-this.speedY, this.speedX);
  }

  /**
   * Set angle in radian keeping current speed (will update speedX and speedY) keeping global speed
   *
   * @param value
   */
  set angle(value: number) {
    this.setSpeedWithAngle(this.speed, value);
  }

  /**
   * Get current angle in degrees
   */
  get angleInDegrees() {
    return this.angle * 180 / Math.PI
  }

  /**
   * Set angle in degrees keeping current speed (will update speedX and speedY) keeping global speed
   * @see Entity.angle
   * @param value
   */
  set angleInDegrees(value: number) {
    this.setSpeedWithAngle(this.speed, value, true);
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
    if (this.board?.collisionResult) {
      return this.body.collides(entity.body, this.board?.collisionResult);
    }
    return false;
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
   * @param options
   */
  onMouseEvent(event: "click" | "dblclick" | "contextmenu" | "mousedown" | "mouseup" | "mouseenter" | "mouseleave" | "mousemove" | "all", callback: (event: MouseEvent, x: number, y: number) => void, options?: DispatcherOptions) {
    this.dispatcher.on(event, callback, options);
  }

  /**
   * Listen mouse event on this entity
   * @param event An event from this list : keyup, keydown, keypress, all
   * @param callback
   * @param options
   */
  onKeyboardEvent(event: "keyup" | "keydown" | "keypress" | "all", callback: (event: KeyboardEvent) => void, options?: DispatcherOptions) {
    this.dispatcher.on(event, callback, options);
  }

  /**
   * Listen for entity intersect with x and y
   * @param x
   * @param y
   * @param callback
   * @param options
   */
  onIntersect(x: number, y: number, callback: (entity: Entity, point: {x: number, y: number}) => void, options?: DispatcherOptions) {
    this.dispatcher.on(`intersect-${x}-${y}`, callback, options);
  }

  /**
   * Listen for the two entities intersection
   * @param entity
   * @param callback
   * @param options
   */
  onIntersectWithEntity(entity: Entity, callback: (entity: Entity, collisionWith: Entity, result: Result) => void, options?: DispatcherOptions) {
    this.dispatcher.on(`entityintersect-${entity.id}`, callback, options);
  }

  onIntersectWithAnyEntity(callback: (entity: Entity, collisionWith: Entity, result: Result) => void, options?: DispatcherOptions) {
    this.dispatcher.on("anyentityintersect", callback, options);
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

  get opacity(): number {
    return this._opacity;
  }

  set opacity(value: number) {
    this._opacity = value;
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
    if (this.board) {
      ctx.globalAlpha = this.opacity;
      ctx.scale(this.board.scale, this.board.scale);
    }
  }
  onDestroy(): void {

  }
  update(delta: number) {
    this._body.x = this.absX;
    this._body.y = this.absY;
    (this._body as Polygon).scale_x = this.zoom;
    (this._body as Polygon).scale_y = this.zoom;
    this.updateGravity(delta);
    this.updateSpeed(delta);
  }

  private updateGravity(delta: number) {
    if (this.board && this.board.gravity > 0 && this._weight > 0) {
      this.falling = true;
      this.speedY += this.board.gravity*delta/1000;
      if (this.speedY > 0 && this.solid) {
        let willY = this.absY+this.height+(this.speedY*delta/1000)+1;
        let willHit = this.board.getEntitiesIn(this.absX+1, willY, this.absX+this.width-1, willY).find((e) => {return e.solid;});
        if (typeof willHit !== 'undefined' && willHit.absY <= this.absY + this.height) {
          this.speedY = 0;
          this.y = willHit.y - this.height;
          this.falling = false;
        }
      }
    }
  }

  /*private getCollisionBellowOverlap(delta: number) {
    let collideBellowOverlap = null;
    if (this.board) {
      //this.body.y += this.board?.gravity*delta/1000;
      //this.board.collisionSystem.update();
      const potentials = this.body.potentials();
      for (const body of potentials) {
        if (this.body.collides(body, this.board.collisionResult)
            && this.board.collisionResult.overlap_y === 1
            && this.solid
            && (body as Circle|Polygon|Point).entity?.solid) {
          collideBellowOverlap = this.board.collisionResult.overlap * this.board.collisionResult.overlap_y;
          break;
        }
      }
      //this.body.y -= this.board?.gravity*delta/1000;
      //this.board.collisionSystem.update();
      return collideBellowOverlap;
    }
  }

  private updateGravity(delta: number) {
    if (this.board && this.board.gravity > 0 && this._weight > 0) {
      let collisionOverlapY = this.getCollisionBellowOverlap(delta);
      if (!collisionOverlapY) {
        this.falling = true;
        this.speedY += this.board?.gravity*delta/1000;
      }else if (this.speedY > 0) {
          this.falling = false;
          this.speedY = 0;
          this.y -= collisionOverlapY-1;
      }
    }
  }*/

  private updateSpeed(delta: number) {
    this.x += this.speedX * delta/1000;
    this.y += this.speedY * delta/1000;
  }

  checkCollisions() {
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
        }else if (event === "anyentityintersect" && this.board.collisionResult) {
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

  /*********************
   * Getters & Setters *
   *********************/
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) { this._disabled = value; }
  get focus(): boolean { return this._focus; }
  set focus(value: boolean) { this._focus = value; }
  //get path() { return this._path; }
}
