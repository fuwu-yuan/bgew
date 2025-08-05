export class BackgroundMappingSettings {
  public static COLUMNS_X = [
    101*1.7,
    302*1.7,
    496*1.7
  ];
  public static COLUMNS_BASE_Y = 348*1.7;
  public static PIECE_SIZE: {HEIGHT: number, WIDTH: number} = {
    HEIGHT : 18*1.7,
    WIDTH : 46*1.7
  }
  public static BUTTONS = {
    SOLVE: {
      X: 686*1.7,
      Y: 268*1.7,
      HEIGHT: 26*1.7,
      WIDTH: 50*1.7
    },
    RESET: {
      X: 622*1.7,
      Y: 268*1.7,
      HEIGHT: 26*1.7,
      WIDTH: 50*1.7
    }
  }
  public static LABELS = {
    STEPS: {
      X: 255*1.7,
      Y: 23*1.7
    },
    TIMER: {
      X: 665,
      Y: 23*1.7
    }
  }

  public static PIECE_GAP = 2*1.7;
}
