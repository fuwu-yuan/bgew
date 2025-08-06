import {Board} from "@fuwu-yuan/bgew";
import {MainStep} from "./steps/main.step";

const board = new Board(
    "My Game",
    "0.0.1",
    800,
    600,
    document.getElementById("game"),
    "white"
);

/* Init and start board */
let mainStep = new MainStep(board);
board.step = mainStep; // First shown step
/* All Steps */
board.addSteps([
    mainStep
]);
board.start();
