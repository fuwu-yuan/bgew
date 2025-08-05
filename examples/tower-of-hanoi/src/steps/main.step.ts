import {Board, Entities, GameStep} from "@fuwu-yuan/bgew";
import {Piece} from "../entities/piece";
import {Column} from '../entities/column'
import {BackgroundMappingSettings} from "../settings/background-mapping";
import {Solver} from "../classes/solver";

export class MainStep extends GameStep {
  name: string = "main";

  level: number = 8;
  startingColumn = 0;
  columns: Column[] = [new Column(0), new Column(1), new Column(2)];
  pieces: Entities.Container = new Entities.Container(0,0, this.board.width, this.board.height);

  grabbedPiece: Piece|null = null;
  grabbedPieceMouseDelta:{x:number,y:number} = {x:0,y:0};

  steps = 0;
  stepsLabel = new Entities.Label(BackgroundMappingSettings.LABELS.STEPS.X, BackgroundMappingSettings.LABELS.STEPS.Y, ''+this.steps, this.board.ctx);

  timerRunning = false;
  timer = 0;
  timerLabel = new Entities.Label(BackgroundMappingSettings.LABELS.TIMER.X, BackgroundMappingSettings.LABELS.TIMER.Y, '00:00:00.000', this.board.ctx);

  constructor(board: Board) {
    super(board);
    this.level = this.getLevelFromUrl();

    // Background
    this.board.addEntity(new Entities.Image('./assets/background/background.jpeg', 0, 0, this.board.width, this.board.height));

    // Init pieces
    this.resetGame();
    this.board.addEntity(this.pieces);

    // Background overlay
    this.board.addEntity(new Entities.Image('./assets/background/overlay.png', 0, 0, this.board.width, this.board.height, null, null, null, null));
    this.board.addEntity(new Entities.Image('./assets/background/particles.webm', 0, 0, this.board.width, this.board.height, null, null, null, null, true));

    // Init buttons
    let solveBtn = new Entities.Button(
      BackgroundMappingSettings.BUTTONS.SOLVE.X,
      BackgroundMappingSettings.BUTTONS.SOLVE.Y,
      BackgroundMappingSettings.BUTTONS.SOLVE.WIDTH,
      BackgroundMappingSettings.BUTTONS.SOLVE.HEIGHT);
    solveBtn.strokeColor = "transparent";
    solveBtn.onMouseEvent("click", this.solveGame.bind(this));
    this.board.addEntity(solveBtn);

    let resetBtn = new Entities.Button(
      BackgroundMappingSettings.BUTTONS.RESET.X,
      BackgroundMappingSettings.BUTTONS.RESET.Y,
      BackgroundMappingSettings.BUTTONS.RESET.WIDTH,
      BackgroundMappingSettings.BUTTONS.RESET.HEIGHT);
    resetBtn.strokeColor = "transparent";
    resetBtn.onMouseEvent("click", this.resetGame.bind(this));
    this.board.addEntity(resetBtn);

    // Init labels
    this.stepsLabel.fontColor = "#fcfbcb";
    this.stepsLabel.fontSize = 22;
    this.board.addEntity(this.stepsLabel);

    this.timerLabel.fontColor = "#fcfbcb";
    this.timerLabel.fontSize = 22;
    this.board.addEntity(this.timerLabel);
  }

  onEnter(): void {
    this.board.onMouseEvent('mousemove', (event, x, y) => {
      if (this.grabbedPiece !== null) {
        this.grabbedPiece.x = x-this.grabbedPieceMouseDelta.x;
        this.grabbedPiece.y = y-this.grabbedPieceMouseDelta.y;
      }
    });
  }

  onLeave(): void {
  }

  update(delta: number) {
    if (this.timerRunning) {
      this.timer += delta;
      this.timerLabel.text = this.formatMilliseconds(this.timer, true);
    }
  }

  grabPiece(piece: Piece) {
    return (event: MouseEvent, x: number, y: number) => {
      console.log(x, y);
      if (!this.timerRunning) this.timerRunning = true;
      if (piece === piece.column[piece.column.length-1]) {
        this.grabbedPiece = piece;
        this.grabbedPieceMouseDelta = {x: x-piece.x, y: y-piece.y};
      }
    }
  }

  releasePiece(piece: Piece) {
    return (event: MouseEvent) => {
      if (this.grabbedPiece) {
        let reset = true;
        let initialCol = this.grabbedPiece.column;
        this.grabbedPiece.column.remove(this.grabbedPiece);
        for (let i = 0; i < 3; i++) {
          if (this.grabbedPiece.x < BackgroundMappingSettings.COLUMNS_X[i] && this.grabbedPiece.x + this.grabbedPiece.width > BackgroundMappingSettings.COLUMNS_X[i]) {
            if (this.columns[i].length === 0 || this.columns[i][this.columns[i].length-1].size > this.grabbedPiece.size) {
              this.columns[i].add(this.grabbedPiece);
              this.incStep();
              reset = false;
              this.checkEnd(this.columns[i]);
            }
          }
        }
        if (reset) {
          initialCol.add(this.grabbedPiece);
        }
        this.grabbedPiece = null;
      }
    }
  }

  incStep(): void {
    this.steps++;
    this.stepsLabel.text = ''+this.steps;
  }

  private formatMilliseconds(milliseconds: number, padStart = false): string {
    function pad(num: number): string {
      return `${num}`.padStart(2, '0');
    }
    const asSeconds = milliseconds / 1000;

    let hours;
    let minutes = Math.floor(asSeconds / 60);
    const seconds = Math.floor(asSeconds % 60);
    let ms = Math.floor(milliseconds - (seconds * 1000 + minutes * 60 * 1000));

    if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      minutes %= 60;
      ms = milliseconds - (seconds * 1000 + minutes * 60000 + hours * 3600000);
    }

    return hours
      ? `${padStart ? pad(hours) : hours}:${pad(minutes)}:${pad(seconds)}:${pad(ms)}`
      : `${padStart ? pad(minutes) : minutes}:${pad(seconds)}:${pad(ms)}`;
  }

  solveGame(event: MouseEvent, x: number, y: number) {
    let toCol = 2;
    let auxCol = 1;
    this.resetGame();
    if (!this.timerRunning) this.timerRunning = true;
    let solver = new Solver();
    let debug = ["A", "B", "C"];
    let it = 0;
    solver.solve(this.level, this.startingColumn, toCol, auxCol, (disk, fromCol, toCol) => {
      it++;
      setTimeout(() => {
        console.log("Move disk " + disk + " from rod " + debug[fromCol] +" to rod " + debug[toCol]);
        let movingDisk = this.columns[fromCol].pop();
        if (movingDisk) {
          this.columns[toCol].add(movingDisk);
          this.incStep();
          this.checkEnd(this.columns[toCol], true);
        }
      }, 300*it);
    });
  }
  resetGame() {
    this.timerRunning = false;
    this.timer = 0;
    this.steps = 0;
    this.timerLabel.text = this.formatMilliseconds(this.timer, true);
    this.stepsLabel.text = ''+this.steps;
    this.pieces.clear();
    this.columns = [new Column(0), new Column(1), new Column(2)];
    for (let i = 0; i < this.level; i++) {
      let piece = new Piece(this.level-i, this.columns[this.startingColumn]);
      piece.onMouseEvent('mousedown', this.grabPiece(piece));
      piece.onMouseEvent('mouseup', this.releasePiece(piece));
      this.columns[this.startingColumn].add(piece);
    }
    this.pieces.addEntities(this.columns[0].concat(this.columns[1]).concat(this.columns[2]));
  }

  private getLevelFromUrl() {
    let level = this.level;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let param = urlParams.get('level');
    if (param !== null) {
      level = !isNaN(parseInt(param)) ? parseInt(param) : this.level;
    }
    if (level < 3) level = 3;
    if (level > this.level) level = this.level;
    return level;
  }

  checkEnd(col: Column, isBot = false) {
    if (col.length === this.pieces.countEntities() && col.index !== this.startingColumn) {
      this.win(isBot);
    }
  }

  private win(isBot = false) {
    this.timerRunning = false;
    setTimeout(() => {
      if (isBot) {
        alert("🤖 Bot solved Tower of Hanoï level " + this.level + " in " + this.formatMilliseconds(this.timer) + " 🦾 Now try it by yourself !");
      }else {
        alert("👏 CONGRATULATION 🎉 You solved Tower of Hanoï level " + this.level + " in " + this.formatMilliseconds(this.timer));
      }
      this.resetGame();
    }, 200);
  }
}
