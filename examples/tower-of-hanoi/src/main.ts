import {Board} from "@fuwu-yuan/bgew";
import {Globals} from "./settings/globals";
import {MainStep} from "./steps/main.step";

const board = new Board(
    Globals.GAME_NAME,
    Globals.GAME_VERSION,
    Globals.CANVAS_WIDTH,
    Globals.CANVAS_HEIGHT,
    document.getElementById("game"),
    "transparent");

/* Init and start board */
initSteps(board);
board.start();

function initSteps(board: Board) {
    /* Init steps */
    if (board) {
        let mainStep = new MainStep(board);
        board.step = mainStep; // First shown step
        /* All Steps */
        board.addSteps([
            mainStep
        ]);
    }
}
