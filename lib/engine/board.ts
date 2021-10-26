import {Entity} from "./entity";
import {GameStep} from "./gamestep";
import {NetworkManager} from "./network";
import {BoardConfig} from "./config";
import {AbstractNetworkManager} from "./network/networkmanager.abstract";
import {Container, Rectangle} from "./entities";
import {Debug} from "../classes/Debug";
import * as workerTimers from 'worker-timers';
import {Dispatcher} from "../classes/Dispatcher";
import {Gameloop} from "../classes/Gameloop";
import {Timer} from "./timer";
import {Collisions, Result} from "detect-collisions";
import {Sound} from "./sound";
const Stats = require("stats.js");

/**
 * The borad is the main part of your Game
 */
export class Board {
  private _canvas: HTMLCanvasElement | undefined;
  entities: Entity[] = [];
  private readonly _ctx: CanvasRenderingContext2D;
  private gameloop: Gameloop|null = null;
  private gameloopId: number|null = null;
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
  private _gameHTMLElement: HTMLElement;
  private _gravity: number = 0;
  private _collisionSystem = new Collisions();
  private _collisionResult = this._collisionSystem.createResult();
  private _sounds: {[key: string]: Sound} = {};
  private _events: Event[] = [];
  private _paused = false;

  constructor(name: string, version: string, width: number, height: number, gameElement: HTMLElement|null = null, background = "transparent", enableHIDPI: boolean = false) {
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
    this.config.board.size.width = width;
    this.config.board.size.height = height;
    this.config.board.background = background;
    this._gameHTMLElement = gameElement !== null ? gameElement : document.body;
    this.canvas = this.createCanvasElem(enableHIDPI);
    this._ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (enableHIDPI) {
      this.ctx.scale(this.getPixelRatio(), this.getPixelRatio());
    }
    this.defaultStrokeStyle = this.ctx.strokeStyle;
    this.defaultFillStyle = this.ctx.fillStyle;
    this.initEvents();
  }

  private createCanvasElem(enableHIDPI: boolean) {
    const elem = document.createElement('canvas');
    elem.width = this.config.board.size.width;
    elem.height = this.config.board.size.height;
    elem.style.background = this.config.board.background;
    this._gameHTMLElement.style.position = "relative";
    this._gameHTMLElement.appendChild(elem);

    if (enableHIDPI) {
      elem.width = this.config.board.size.width * this.getPixelRatio();
      elem.height = this.config.board.size.height * this.getPixelRatio();
      elem.style.width = this.config.board.size.width + "px";
      elem.style.height = this.config.board.size.height + "px";
    }

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
    if (this.debug.stats) {
      var stats = new Stats();
      stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild( stats.dom );
    }
    this.step.onEnter({});
    this.gameloop = new Gameloop();
    this.gameloopId = this.gameloop.setGameLoop((delta) => {
      if (this.debug.stats) stats.begin();
      // Canvas resize handle
      this.canvas.width = this.config.board.size.width * this.scale;
      this.canvas.height = this.config.board.size.height * this.scale;
      // Inputs
      this.dispatchMouseEvents();
      this.dispatchKeyboardEvents();
      if (!this.paused) {
        // Update
        this.step.update(delta*1000);
        // Collision
        this.collisionSystem.update();
        this.step.checkCollisions();
        // Draw
        this.step.draw();
      }
      if (this.debug.stats) stats.end();
      //console.log(Math.round(1000/(delta*1000)) + " FPS");
    }, 1000 / this._config.game.FPS)
  }

  /*private loop(lastUpdate: number, lastLoopDuration: number = 0) {
    setTimeout(() => {
      let now = (new Date()).getTime();
      let delta = now - lastUpdate;
      lastUpdate = now;
      this.canvas.width = this.config.board.size.width * this.scale;
      this.canvas.height = this.config.board.size.height * this.scale;
      this.step.update(delta);
      this.step.draw();
      let after = (new Date()).getTime();
      this.loop(lastUpdate, after-now);
    }, (1000/this._config.game.FPS));
  }*/

  /**
   * Stop the game loop (game will freeze)
   */
  stop() {
    if (this.gameloop && this.gameloopId) {
      this.gameloop.clearGameLoop(this.gameloopId);
    }
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

  get paused(): boolean {
    return this._paused;
  }

  set paused(paused: boolean) {
    this._paused = paused;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
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
   * @param fade
   */
  moveToStep(step: string, data: any = {}, fade?: {color: string, duration: number}) {
      if (fade) {
        const self = this;
        this.addEntity(new class extends Rectangle {
          protected _opacity = 0;
          update(delta: number) {
            if (this.opacity < 1) {
              this.opacity += 1/(fade.duration/delta);
              if (this.opacity > 1) { this.opacity = 1; }
            }else {
              if (self.step) {
                self.step.onLeave();
              }
              self.step = self.steps[step];
              if (self.step) {
                self.reset();
                self.step.onEnter(data);
                self.addEntity(new class extends Rectangle {
                  protected _opacity = 1;
                  update(delta: number) {
                    if (this.opacity > 0) {
                      this.opacity -= 1/(fade.duration/delta);
                      if (this.opacity < 0) { this.opacity = 0; }
                    }else {
                      self.removeEntity(this);
                    }
                  }
                }(0, 0, this.width, this.height, fade.color, fade.color));
                self.step.draw();
              }else {
                console.error("No step found with name '" + step + "'");
              }
            }
          }
        }(0, 0, this.width, this.height, fade.color, fade.color));
      }else {
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

  /**
   * Remove the entity from board.
   * The entity will disappear from the game
   * @param entity
   */
  removeEntity(entity: Entity) {
    const index: number = this.entities.indexOf(entity, 0);
    if (index > -1) {
      if (this.entities[index] instanceof Container) {
        (this.entities[index] as Container).removeEntities((this.entities[index] as Container).entities);
      }
      this.entities.splice(index, 1);
      this.collisionSystem.remove(entity.body);
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
  changeCursor(cursor: "auto" | "inherit" | "crosshair" | "default" | "help" | "move" | "pointer" | "progress" | "text" | "wait" | "e-resize" | "ne-resize" | "nw-resize" | "n-resize" | "se-resize" | "sw-resize" | "s-resize" | "w-resize" | "none" | "context-menu" | "cell" | "vertical-text" | "alias" | "copy" | "no-drop" | "not-allowed" | "ew-resize" | "ns-resize" | "nesw-resize" | "nwse-resize" | "col-resize" | "row-resize" | "all-scroll" | "grab" | "grabbing" | "zoom-in" | "zoom-out" | string) {
    this._lastCursor = document.body.style.cursor;
    document.body.style.cursor = cursor;
  }

  restoreCursor() {
    document.body.style.cursor = this._lastCursor;
  }

  /**
   * Register a sound to play it later using function {@link playSound}
   * @param name Sound name
   * @param src One or more src (same sound with multiple src formats)
   * @param repeat Ether to repeat of not the sound at the end
   * @param volume Volume to play sound by default (default 0.5)
   * @param sprites Object defining sprites in this sound (optional)
   * @return Sound the newly created sound
   */
  registerSound(name: string, src: string|string[], repeat: boolean = false, volume: number = 0.5, sprites: {[key: string]: [number, number]} = {}): Sound {
    let sound = new Sound(name, src, repeat, volume, sprites);
    this._sounds[name] = sound;
    return sound;
  }

  getSound(name: string) {
    if (typeof this._sounds[name] !== 'undefined') {
      return this._sounds[name];
    }
    console.error("No sound registed with name '" + name + "'. Registered sounds : " + Object.keys(this._sounds).join(' | '));
    return null;
  }

  /**
   * Play a sound previously registered using function {@link registerSound}
   * @param name the registered sound name
   * @param repeat play the sound again at the end
   * @param volume volume to play the sound (between 0.0 and 1.0)
   * @param sprite the sprite to play
   */
  playSound(name: string, repeat?: boolean, volume?: number, sprite?: string): number | null {
    if (typeof this._sounds[name] !== 'undefined') {
      return this._sounds[name].play(repeat, volume, sprite);
    }
    console.error("No sound registed with name '" + name + "'. Registered sounds : " + Object.keys(this._sounds).join(' | '));
    return null;
  }

  /**
   * Stop the sound
   *
   * @param name Sound name
   * @param fadeout Ether to fadeout the sound before stopping it
   * @param fadeDuration Fadeout duration
   * @param id Optional sound id
   */
  stopSound(name: string, fadeout: boolean = false, fadeDuration: number = 1000, id?: number) {
    if (typeof this._sounds[name] !== 'undefined') {
      this._sounds[name].stop(fadeout, fadeDuration, id);
    }else {
      console.error("No sound registed with name '" + name + "'. Registered sounds : " + Object.keys(this._sounds).join(' | '));
    }
  }

  /**
   * Remove all entities and clear the board
   */
  reset() {
    for (const entity of this.entities) {
      entity.onDestroy();
    }
    this.entities = [];
    this._collisionSystem = new Collisions();
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
   * @private
   */
  private dispatchMouseEvents() {
    for (let i = 0; i < this._events.length; i++) {
      let event = this._events[i];
      if (event instanceof MouseEvent) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (1/this.scale);
        const y = (event.clientY - rect.top) * (1/this.scale);
        this.dispatcher.dispatch(event.type, event, x, y);
        this.entities.forEach(function (entity: Entity) {
          if (entity.disabled || !entity.visible) return;
          if (entity.intersect(x, y, event)) {
            if (event.type === "mousemove") {
              if (!entity.hovered) {
                entity.hovered = true;
                entity.dispatcher.dispatch("mouseenter", new MouseEvent("mouseenter", event), x, y);
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
                entity.dispatcher.dispatch("mouseleave", new MouseEvent("mouseleave", event), x, y);
              }
            }
            if (event.type === "click") {
              if (entity.focus) {
                entity.focus = false;
              }
            }
          }
        });
        this._events.splice(i, 1);
        i--;
      }
    }
  }

  /**
   * On keyboard event, catch it and dispatch right event to entities
   *
   * @private
   */
  private dispatchKeyboardEvents() {
    for (let i = 0; i < this._events.length; i++) {
      let event = this._events[i];
      if (event instanceof KeyboardEvent) {
        this.dispatcher.dispatch(event.type, event);
        this.entities.forEach(function (entity: Entity) {
          if (entity.disabled || !entity.visible) return;
          if (entity.focus) {
            entity.dispatcher.dispatch(event.type, event);
          }
        });
        this._events.splice(i, 1);
        i--;
      }
    }
  }

  /**
   * Listen mouse event on this entity
   * @param event An event from this list : click, dblclick, contextmenu, mousedown, mouseup, mouseenter, mouseleave, mousemove, all
   * @param callback
   */
  onMouseEvent(event: "click" | "dblclick" | "contextmenu" | "mousedown" | "mouseup" | "mouseenter" | "mouseleave" | "mousemove" | "all", callback: (event: MouseEvent, x: number, y: number) => void) {
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

  set width(value: number) {
    this.config.board.size.width = value;
    this.canvas.width = value;
  }

  set height(value: number) {
    this.config.board.size.height = value;
    this.canvas.height = value;
  }

  get scale(): number {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;
  }

  get gravity(): number {
    return this._gravity;
  }

  set gravity(value: number) {
    this._gravity = value;
  }

  get debug(): Debug {
    return this._debug;
  }

  get gameHTMLElement(): HTMLElement {
    return this._gameHTMLElement;
  }

  getEntitiesAt(x: number|null = null, y: number|null = null) {
    let entities = [];
    for (const entity of this.entities) {
      if (y === null && x !== null) {
        if (entity.absX <= x && entity.absX + entity.width >= x) {
          entities.push(entity);
        }
      }else if (x === null && y !== null) {
        if (entity.absY <= y && entity.absY + entity.height >= y) {
          entities.push(entity);
        }
      }else if (x !== null && y !== null) {
        if (entity.intersect(x, y) && entities.indexOf(entity) === -1) {
          entities.push(entity);
        }
      }
    }
    return entities;
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

  getPixelRatio() {
    return (window.devicePixelRatio || 1);
  };

  /**
   * Shortcut to add timer to current GameStep {@link GameStep.addTimer}
   * @param time
   * @param end
   * @param repeat
   */
  addTimer(time: number, end: () => void, repeat: boolean = false): Timer {
    return this.step.addTimer(time, end, repeat);
  }

  /**
   * Shortcut to remove timer from current GameStep {@link GameStep.removeTimer}
   * @param timer
   */
  removeTimer(timer: Timer) {
   this.step.removeTimer(timer);
  }

  get collisionSystem(): Collisions {
    return this._collisionSystem;
  }

  get collisionResult(): Result {
    return this._collisionResult;
  }

  private saveEventForLater(event: Event) {
    this._events.push(event);
  }

  /**
   * Init all events from the board
   *
   * @private
   */
  private initEvents() {
    this.canvas.addEventListener('click', this.saveEventForLater.bind(this));
    this.canvas.addEventListener('dblclick', this.saveEventForLater.bind(this));
    this.canvas.addEventListener('contextmenu', this.saveEventForLater.bind(this));
    this.canvas.addEventListener('mousedown', this.saveEventForLater.bind(this));
    this.canvas.addEventListener('mouseup', this.saveEventForLater.bind(this));
    this.canvas.addEventListener('mouseenter', this.saveEventForLater.bind(this));
    this.canvas.addEventListener('mouseleave', this.saveEventForLater.bind(this));
    this.canvas.addEventListener('mousemove', this.saveEventForLater.bind(this));

    window.addEventListener("keyup", this.saveEventForLater.bind(this));
    window.addEventListener("keydown", this.saveEventForLater.bind(this));
    window.addEventListener("keypress", this.saveEventForLater.bind(this));
  }
}
