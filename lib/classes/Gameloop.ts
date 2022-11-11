import browserHrtime from 'browser-process-hrtime';
import * as workerTimers from 'worker-timers';

export class Gameloop {
// Taken and modified from https://github.com/timetocode/node-game-loop
// Thanks to https://github.com/norlin/node-gameloop for making this faster

    private activeLoops: number[] = [];

    private getLoopId = (function() {
        let staticLoopId = 0;

        return function() {
            return staticLoopId++;
        }
    })();

    private getNano() {
        var hrtime = browserHrtime();
        return (+hrtime[0]) * this.s2nano + (+hrtime[1]);
    }

    private s2nano = 1e9;
    private nano2s = 1 / this.s2nano; // avoid a divide later, although maybe not nessecary
    private ms2nano = 1e6;

    /**
     * Create a game loop that will attempt to update at some target `tickLengthMs`.
     *
     * `tickLengthMs` defaults to 30fps (~33.33ms).
     *
     * Internally, the `gameLoop` function created has two mechanisms to update itself.
     * One for coarse-grained updates (with `setTimeout`) and one for fine-grained
     * updates (with `setImmediate`).
     *
     * On each tick, we set a target time for the next tick. We attempt to use the coarse-
     * grained "long wait" to get most of the way to our target tick time, then use the
     * fine-grained wait to wait the remaining time.
     */
    public setGameLoop = (update: (delta: number) => void, tickLengthMs: number = 1000 / 30) => {
        let loopId = this.getLoopId();
        this.activeLoops.push(loopId);

        // expected tick length
        const tickLengthNano = tickLengthMs * this.ms2nano;

        // We pick the floor of `tickLengthMs - 1` because the `setImmediate` below runs
        // around 16ms later and if our coarse-grained 'long wait' is too long, we tend
        // to miss our target framerate by a little bit
        const longwaitMs = Math.floor(tickLengthMs - 1);
        const longwaitNano = longwaitMs * this.ms2nano;

        let prev = this.getNano();
        let target = this.getNano();

        let frame = 0;

        const gameLoop = () => {
            frame++;

            const now = this.getNano();

            if (now >= target) {
                const delta = now - prev;

                prev = now;
                target = now + tickLengthNano;

                // actually run user code
                update(delta * this.nano2s);
            }

            // do not go on to renew loop if no longer active
            if (this.activeLoops.indexOf(loopId) === -1) {
                return;
            }

            // re-grab the current time in case we ran update and it took a long time
            const remainingInTick = target - this.getNano();
            if (remainingInTick > longwaitNano) {
                // unfortunately it seems our code/node leaks memory if setTimeout is
                // called with a value less than 16, so we give up our accuracy for
                // memory stability
                workerTimers.setTimeout(gameLoop, Math.max(longwaitMs, 16));
            } else {
                workerTimers.setTimeout(gameLoop,0);
            }
        }

        // begin the loop!
        gameLoop();

        return loopId;
    };

    public clearGameLoop = (loopId: number) => {
        // remove the loop id from the active loops
        this.activeLoops.splice(this.activeLoops.indexOf(loopId), 1);
    };
}
