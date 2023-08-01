export enum BlockType {
  I=0,
  L,
  J ,
  O ,
  Z,
  S,
  T,
}

export const Data: Map<BlockType, number[][]> = new Map([
  [
    BlockType.I,
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ]
  ],
  [
    BlockType.L,
    [
      [0, 2, 0],
      [0, 2, 0],
      [0, 2, 2],
    ]
  ],
  [
    BlockType.J,
    [
      [0, 3, 0],
      [0, 3, 0],
      [3, 3, 0],
    ]
  ],
  [
    BlockType.O,
    [
      [4, 4],
      [4, 4],
    ]
  ],
  [
    BlockType.Z,
    [
      [5, 5, 0],
      [0, 5, 5],
      [0, 0, 0],
    ]
  ],
  [
    BlockType.S,
    [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ]
  ],
  [
    BlockType.T,
    [
      [0, 7, 0],
      [7, 7, 7],
      [0, 0, 0],
    ]
  ],
])

