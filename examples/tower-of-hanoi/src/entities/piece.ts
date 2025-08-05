import {Entities} from '@fuwu-yuan/bgew';
import {BackgroundMappingSettings} from '../settings/background-mapping';
import {Column} from "./column";

export class Piece extends Entities.Image {

  size: number;
  column: Column;

  constructor(size: number, column: Column) {
    super(
      './assets/images/piece.png',
      BackgroundMappingSettings.COLUMNS_X[column.index] - BackgroundMappingSettings.PIECE_SIZE.WIDTH * size / 2,
      BackgroundMappingSettings.COLUMNS_BASE_Y - BackgroundMappingSettings.PIECE_SIZE.HEIGHT,
      BackgroundMappingSettings.PIECE_SIZE.WIDTH * (1+size/3),
      BackgroundMappingSettings.PIECE_SIZE.HEIGHT
    );
    this.size = size;
    this.column = column;
  }
}
