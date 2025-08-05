import {Board} from "./board";
import {Entity} from "./entity";
import {SocketMessage} from "./network";
import {Camera} from "./camera";
import {Timer} from "./timer";

export abstract class GameStep {
  abstract name: string;
  private _board: Board;
  private _camera: Camera;
  private _timers: Timer[] = [];

  constructor(board: Board) {
    this._board = board;
    this._camera = new Camera();
  }

  get board() {
    return this._board;
  }

  onNetworkMessage(msg: SocketMessage) {}
  onPlayerJoin(msg: SocketMessage){}
  onPlayerLeave(msg: SocketMessage){}
  onConnectionClosed(){}

  abstract onEnter(data: any): void;
  abstract onLeave(): void;

  /**
   * Game update loop
   */
  update(delta: number) {
    if (this.board.canvas && this.board.ctx) {
      this.board.entities.forEach(function(entity: Entity) {
        entity.update(delta);
      });
    }
    for (const timer of this._timers) {
      timer.update(delta);
    }
  }

  checkCollisions() {
    if (this.board.canvas && this.board.ctx) {
      this.board.entities.forEach(function(entity: Entity) {
        entity.checkCollisions();
      });
    }
  }

  /**
   * Game draw loop
   */
  draw() {
    if (this.board.canvas) {
      // Clear canvas
      this.board.clear();
      if (this.camera) {
        this.board.ctx.translate(-this.camera.x, -this.camera.y);
      }else {
        console.error("Missing camera");
      }
      this.board.entities.forEach((entity: Entity) => {
        if (entity.visible) {
          // Reset style
          this.board.resetStyles();
          // Save context
          this.board.ctx.save();
          // Rotate context from entity center
          if (entity.rotate !== 0) {
            this.board.ctx.translate(entity.x * this.board.scale + entity.width * this.board.scale/2, entity.y * this.board.scale + entity.height * this.board.scale/2);
            this.board.ctx.rotate(entity.rotate);
            this.board.ctx.translate((entity.x * this.board.scale + entity.width * this.board.scale/2)*-1, (entity.y * this.board.scale + entity.height * this.board.scale/2)*-1);
          }

          // Draw entity
          entity.draw(this.board.ctx as CanvasRenderingContext2D);
          // Restore context
          this.board.ctx.restore();
        }
      });
      if (this.board?.debug.collision && this.board?.collisionSystem) {
        this.board.ctx.strokeStyle = '#FF0000';
        this.board.ctx.beginPath();
        this.board?.collisionSystem.draw(this.board.ctx);
        this.board.ctx.stroke();
      }
    }
  }

  get camera(): Camera {
    return this._camera;
  }

  set camera(value: Camera) {
    this._camera = value;
  }

  addTimer(time: number, end: () => void, repeat: boolean = true): Timer {
    let timer = new Timer(time, end, () => {
      this.removeTimer(timer);
    });
    timer.repeat = repeat;
    this._timers.push(timer);
    return timer;
  }

  removeTimer(timer: Timer) {
    const index: number = this._timers.indexOf(timer, 0);
    if (index > -1) {
      this._timers.splice(index, 1);
    }
  }
}
