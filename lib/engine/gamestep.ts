import {Board} from "./board";
import {Entity} from "./entity";
import {SocketMessage} from "./network/socketMessage";

export abstract class GameStep {
  abstract name: string;

  private _board: Board;

  constructor(board: Board) {
    this._board = board;
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
  }

  /**
   * Game draw loop
   */
  draw() {
    if (this.board.canvas) {
      // Clear canvas
      this.board.clear();
      this.board.entities.forEach((entity: Entity) => {
        if (entity.visible) {
          // Reset style
          this.board.resetStyles();
          // Save context
          this.board.ctx.save();
          // Translate context
          this.board.ctx.translate(entity.translate.x, entity.translate.y);
          // Rotate context from entity center
          this.board.ctx.translate(entity.x + entity.width/2, entity.y + entity.height/2);
          this.board.ctx.rotate(entity.rotate);
          this.board.ctx.translate((entity.x + entity.width/2)*-1, (entity.y + entity.height/2)*-1);

          // Draw entity
          entity.draw(this.board.ctx as CanvasRenderingContext2D);
          // Restore context
          this.board.ctx.restore();
        }
      });
    }
  }

  debug() {
    this.board.entities.forEach((entity: Entity) => {
      if (entity.visible) {
        // Reset style
        this.board.resetStyles();
        // Save context
        this.board.ctx.save();
        // Translate context

        entity.debug(this.board.ctx);

        // Rotate context from entity center
        this.board.ctx.translate(entity.x + entity.width/2, entity.y + entity.height/2);
        this.board.ctx.rotate(entity.rotate);
        this.board.ctx.translate((entity.x + entity.width/2)*-1, (entity.y + entity.height/2)*-1)
        // Draw entity
        entity.draw(this.board.ctx as CanvasRenderingContext2D);
        // Restore context
        this.board.ctx.restore();
      }
    });
  }
}
