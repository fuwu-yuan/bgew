import {Entity} from "./entity";
import {GameStep} from "./gamestep";
import {NetworkManager} from "./network/networkmanager";
import {BoardConfig} from "./config";
import {AbstractNetworkManager} from "./network/networkmanager.abstract";
import {Container} from "./entities";
import {Debug} from "../classes/Debug";
import * as workerTimers from 'worker-timers';
import {Dispatcher} from "../classes/Dispatcher";

/**
 * The borad is the main part of your Game
 */
export class Board {
  private _canvas: HTMLCanvasElement | undefined;
  entities: Entity[] = [];
  private readonly _ctx: CanvasRenderingContext2D;
  private runningInterval: any;
  private readonly _config;
  private readonly defaultStrokeStyle: string | CanvasGradient | CanvasPattern;
  private readonly defaultFillStyle: string | CanvasGradient | CanvasPattern;
  private steps: { [key: string]: GameStep; } = {};
  private _step: GameStep|null = null;
  private _networkManager: AbstractNetworkManager;
  private _name: string;
  private _version: string;
  private _lastCursor: string = "default";
  private _debug: Debug;
  private dispatcher = new Dispatcher();
  private _scale: number = 1;
  private _gameHTMLElement: HTMLElement = document.body;

  constructor(name: string, version: string, width: number, height: number, gameElement: HTMLElement|null = null, background = "transparent") {
    // @ts-ignore
    window.setTimeout = workerTimers.setTimeout;
    // @ts-ignore
    window.clearTimeout = workerTimers.clearTimeout;
    // @ts-ignore
    window.setInterval = workerTimers.setInterval;
    // @ts-ignore
    window.clearInterval = workerTimers.clearInterval;
    this._name = name;
    this._version = version;
    this._networkManager = new NetworkManager(this);
    this._config = new BoardConfig();
    this._debug = new Debug();
    this._config.board.size.width = width;
    this.config.board.size.height = height;
    this.config.board.background = background;
    this._gameHTMLElement = gameElement !== null ? gameElement : this._gameHTMLElement;
    this.canvas = this.createCanvasElem();
    this._ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.defaultStrokeStyle = this.ctx.strokeStyle;
    this.defaultFillStyle = this.ctx.fillStyle;
    this.initEvents();
  }

  private createCanvasElem() {
    const elem = document.createElement('canvas');
    elem.width = this.config.board.size.width;
    elem.height = this.config.board.size.height;
    elem.style.background = this.config.board.background;
    this._gameHTMLElement.style.position = "relative";
    this._gameHTMLElement.appendChild(elem);

    return elem;
  }

  countEntities(): number {
    let count = this.entities.length;
    for (const entity of this.entities) {
      if (entity instanceof Container) {
        count += entity.countEntities();
      }
    }
    return count;
  }

  /**
   * Start the game loop (update and draw entities)
   */
  start() {
    this.step.onEnter({});
    let lastUpdate = (new Date()).getTime();

    this.runningInterval = setInterval(() => {
      let now = (new Date()).getTime();
      let delta = now - lastUpdate;
      lastUpdate = now;
      this.canvas.width = this.config.board.size.width * this.scale;
      this.canvas.height = this.config.board.size.height * this.scale;
      this.step.update(delta);
      this.step.draw();
    }, 1000/this._config.game.FPS);
  }

  /**
   * Stop the game loop (game will freeze)
   */
  stop() {
    clearInterval(this.runningInterval);
  }

  /**
   * Add a step in step list (you need to add your game step before calling moveToStep(step))
   * @param step
   */
  addStep(step: GameStep) {
    this.steps[step.name] = step;
  }

  /**
   * Add an array of steps (you need to add your game step before calling moveToStep(step))
   * @param steps
   */
  addSteps(steps: GameStep[]) {
    steps.forEach((step: GameStep) => {
      this.addStep(step);
    })
  }

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  /**
   * Get Network Manager
   */
  get networkManager(): AbstractNetworkManager {
    return this._networkManager;
  }

  set networkManager(networkManager: AbstractNetworkManager) {
    this._networkManager = networkManager;
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas as HTMLCanvasElement;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }

  /**
   * Get the current step
   */
  get step(): GameStep {
    return this._step as GameStep;
  }

  /**
   * Set the current step (no transitions function is called (onEnter / onLeave))
   *
   * @param step
   */
  set step(step: GameStep) {
    this._step = step;
  }

  /**
   * The the game config
   */
  get config(): BoardConfig {
    return this._config;
  }

  /**
   * Change the game step (will call onLeave of current step, and onEnter on new step)
   * @param step
   * @param data
   */
  moveToStep(step: string, data: any = {}) {
    if (this.step) {
      this.step.onLeave();
    }
    this.step = this.steps[step];
    if (this.step) {
      this.reset();
      this.step.onEnter(data);
      this.step.draw();
    }else {
      console.error("No step found with name '" + step + "'");
    }
  }

  /**
   * Add an entity to the board.
   * Entity will be updated and drawn immediately (calling update() and draw() from entity)
   *
   * @param entity
   */
  addEntity(entity: Entity) {
    entity.init(this);
    this.entities.push(entity);
  }

  /**
   * Add multiple entities
   * This function will call addEntity(entity) for each entity of the array
   * @param entities
   */
  addEntities(entities: Entity[]) {
    for (const entity of entities) {
      this.addEntity(entity);
    }
  }

  /**
   * Remove the entity from board.
   * The entity will disappear from the game
   * @param entity
   */
  removeEntity(entity: Entity) {
    const index: number = this.entities.indexOf(entity, 0);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }

  /**
   * Remove all the entities from board.
   * The entities will disappear from the game
   * @param entities
   */
  removeEntities(entities: Entity[]) {
    for (let entity of entities) {
      this.removeEntity(entity);
    }
  }

  /**
   * Change the cursor
   * @param cursor
   */
  changeCursor(cursor: string) {
    this._lastCursor = document.body.style.cursor;
    document.body.style.cursor = cursor;
  }

  restoreCursor() {
    document.body.style.cursor = this._lastCursor;
  }

  /**
   * Remove all entities and clear the board
   */
  reset() {
    for (const entity of this.entities) {
      entity.onDestroy();
    }
    this.entities = [];
    this.clear()
    document.body.style.cursor = "default";
  }

  /**
   * Clear the board (will be drawn again on next game loop)
   */
  public clear() {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //this.ctx?.beginPath();
  }

  /**
   * Get the CanvasRenderingContext2D to draw
   */
  get ctx() {
    return this._ctx;
  }

  /**
   * Reset all styles (stroke and fill)
   */
  resetStyles() {
    this.ctx.strokeStyle = this.defaultStrokeStyle;
    this.ctx.fillStyle = this.defaultFillStyle;
  }

  /**
   * On mouse event, catch it and dispatch right event to entities
   *
   * @param event
   * @private
   */
  private dispatchMouseEvent(event: MouseEvent) {
    event.preventDefault();
    this.dispatcher.dispatch(event.type, event);
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (1/this.scale);
    const y = (event.clientY - rect.top) * (1/this.scale);
    this.entities.forEach(function (entity: Entity) {
      if (entity.disabled || !entity.visible) return;
      if (entity.intersect(x, y, event)) {
        if (event.type === "mousemove") {
          if (!entity.hovered) {
            entity.hovered = true;
            entity.dispatcher.dispatch("mouseenter", new MouseEvent("mouseenter", event));
          }
        }
        if (event.type === "click") {
          if (!entity.focus) {
            entity.focus = true;
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
        if (event.type === "click") {
          if (entity.focus) {
            entity.focus = false;
          }
        }
      }
    });
  }

  /**
   * On keyboard event, catch it and dispatch right event to entities
   *
   * @param event
   * @private
   */
  private dispatchKeyboardEvent(event: KeyboardEvent) {
    this.dispatcher.dispatch(event.type, event);
    this.entities.forEach(function (entity: Entity) {
      if (entity.disabled || !entity.visible) return;
      if (entity.focus) {
        entity.dispatcher.dispatch(event.type, event);
      }
    });
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

  get width() {
    return this.config.board.size.width;
  }

  get height() {
    return this.config.board.size.height;
  }

  get scale(): number {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;
  }

  get debug(): Debug {
    return this._debug;
  }

  get gameHTMLElement(): HTMLElement {
    return this._gameHTMLElement;
  }

  /**
   * Init all events from the board
   *
   * @private
   */
  private initEvents() {
    this.canvas.addEventListener('click', this.dispatchMouseEvent.bind(this));
    this.canvas.addEventListener('dblclick', this.dispatchMouseEvent.bind(this));
    this.canvas.addEventListener('contextmenu', this.dispatchMouseEvent.bind(this));
    this.canvas.addEventListener('mousedown', this.dispatchMouseEvent.bind(this));
    this.canvas.addEventListener('mouseup', this.dispatchMouseEvent.bind(this));
    this.canvas.addEventListener('mouseenter', this.dispatchMouseEvent.bind(this));
    this.canvas.addEventListener('mouseleave', this.dispatchMouseEvent.bind(this));
    this.canvas.addEventListener('mousemove', this.dispatchMouseEvent.bind(this));

    window.addEventListener("keyup", this.dispatchKeyboardEvent.bind(this));
    window.addEventListener("keydown", this.dispatchKeyboardEvent.bind(this));
    window.addEventListener("keypress", this.dispatchKeyboardEvent.bind(this));
  }
}
