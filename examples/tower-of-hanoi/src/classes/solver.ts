export class Solver {
  solve(n: number, fromCol: number,  toCol: number, auxCol: number, callback: (disk: number, fromCol: number, toCol: number) => void): void {
    if (n === 0) return;
    this.solve(n - 1, fromCol, auxCol, toCol, callback);
    callback(n, fromCol, toCol);
    this.solve(n - 1, auxCol, toCol, fromCol, callback);
  }
}
