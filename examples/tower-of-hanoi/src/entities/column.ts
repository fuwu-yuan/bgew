import {BackgroundMappingSettings} from "../settings/background-mapping";
import {Piece} from "./piece";

export class Column extends Array<Piece> {
  index: number;

  constructor(index: number) {
    super();
    this.index = index;
  }

  /**
   * Add a piece to the column and return the added piece
   * @return Piece
   * @param piece
   */
  add(piece: Piece) {
    piece.x = BackgroundMappingSettings.COLUMNS_X[this.index] - piece.width / 2;
    piece.y = BackgroundMappingSettings.COLUMNS_BASE_Y - piece.height - (BackgroundMappingSettings.PIECE_SIZE.HEIGHT+BackgroundMappingSettings.PIECE_GAP)*(this.length);
    piece.column = this;
    this.push(piece);
  }

  /**
   * Remove a piece from the column and return the removed piece
   * @return Piece
   * @param piece
   */
  remove(piece: Piece) {
    const index = this.indexOf(piece);
    if (index === -1) {
      throw new Error(`${piece} not in list`);
    }
    this.splice(index, 1);
    return piece;
  }
}
