import {Board, Entities, GameStep} from "@fuwu-yuan/bgew";

export class MainStep extends GameStep {
    name: string = "main";
    private titleEntity: Entities.Label;

    constructor(board: Board) {
        super(board);
        this.titleEntity = new Entities.Label(0, 0, this.board.name, this.board.ctx);
        this.titleEntity.fontSize = 100;
        this.titleEntity.x = this.board.width / 2 - this.titleEntity.width / 2;
        this.titleEntity.y = this.board.height / 2 - this.titleEntity.height / 2;
        this.board.addEntity(this.titleEntity);
    }

    onEnter(): void {
        this.board.onMouseEvent('mousemove', (event, x, y) => {
            this.titleEntity.x = x - this.titleEntity.width / 2;
            this.titleEntity.y = y - this.titleEntity.height;
        });
    }

    onLeave(): void {}
    update(delta: number) {}
}
