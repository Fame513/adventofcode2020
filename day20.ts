import {getInput, getTestFunction} from './helper';

const DAY = 20;

class Part {
  id: number;
  image: string[][];

  constructor(id: number, image: string[][]) {
    this.id = id;
    this.image = image;

  }

  getAllSideIds(): number[] {
    const size = this.image.length;
    let side1 = '', side2 = '', side3 = '', side4 = '';
    for (let i = 0; i < size; i++) {
      side1 += this.image[0][i] === '#' ? '1' : '0';
      side2 += this.image[i][size - 1] === '#' ? '1' : '0';
      side3 += this.image[size - 1][size - 1 - i] === '#' ? '1' : '0';
      side4 += this.image[size - 1 - i][0] === '#' ? '1' : '0';
    }
    const clockSide = [side1, side2, side3, side4];
    const counterClockSide = clockSide.map(v => v.split('').reverse().join(''))
    return [...clockSide.map(v => Number.parseInt(v, 2)),
      ...counterClockSide.map(v => Number.parseInt(v, 2))]
  }

  flip(): Part {
    return new Part(this.id, this.image.reverse());
  }

  getSideId(side: string): number {
    return Number.parseInt(side.split('').map(v => v === '#' ? '1' : 0).join(''), 2);
  }

  rotate(count: number): Part {
    count = (count + 4) % 4;
    const size = this.image.length;
    let result = this.image;
    for (let i = 0; i < count; i++) {
      const newImage = [];
      for (let y = 0; y < size; y++) {
        newImage[y] = [];
        for (let x = 0; x < size; x++) {
          newImage[y][x] = result[size - 1 - x][y];
        }
      }
      result = newImage;
    }
    return new Part(this.id, result);
  }

  getImmage(): string {
    return this.image.map(row => row.join('')).join('\n')
  }

  getInnerImage(): string[] {
    return this.image.slice(1, -1).map(row => row.slice(1, -1).join(''))
  }

  getTopSide(): string {
    let result = '';
    const size = this.image.length;
    for (let i = 0; i < size; i++) {
      result += this.image[0][i];
    }
    return result;
  }

  getRightSide(): string {
    let result = '';
    const size = this.image.length;
    for (let i = 0; i < size; i++) {
      result += this.image[i][size - 1];
    }
    return result;
  }

  getBottomSide(): string {
    let result = '';
    const size = this.image.length;
    for (let i = 0; i < size; i++) {
      result += this.image[size - 1][i];
    }
    return result;
  }

  getLeftSide(): string {
    let result = '';
    const size = this.image.length;
    for (let i = 0; i < size; i++) {
      result += this.image[i][0];
    }
    return result;
  }

  getTopId(): number {
    return this.getSideId(this.getTopSide());
  }

  getRightId(): number {
    return this.getSideId(this.getRightSide());
  }

  getBottomId(): number {
    return this.getSideId(this.getBottomSide());
  }

  getLeftId(): number {
    return this.getSideId(this.getLeftSide());
  }
}

function rotateMap(map: string[]): string[] {
  const size = map.length;
  const newImage: string[][] = [];
  for (let y = 0; y < size; y++) {
    newImage[y] = [];
    for (let x = 0; x < size; x++) {
      newImage[y][x] = map[size - 1 - x][y];
    }
  }
  return newImage.map(row => row.join(''))
}

function detectMonsters(map: string[]): boolean {
  let result = false;
  const monster = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
  ];
  const minsterSize = monster.join('').split('').filter(v => v === '#').length
  const arrayMap = map.map(v => v.split(''));
  const arrayMonster = monster.map(v => v.split(''));

  for (let y = 0; y < arrayMap.length - arrayMonster.length; y++) {
    for (let x = 0; x < arrayMap[y].length - arrayMonster[0].length; x++) {
      let match = 0;
      for (let dy = 0; dy < arrayMonster.length; dy++) {
        for (let dx = 0; dx < arrayMonster[dy].length; dx++) {
          if (arrayMonster[dy][dx] === '#' && arrayMap[y+dy][x+dx] === '#') {
            match++;
          }
        }
      }
      if (match === minsterSize) {
        result = true;
        for (let dy = 0; dy < arrayMonster.length; dy++) {
          for (let dx = 0; dx < arrayMonster[dy].length; dx++) {
            if (arrayMonster[dy][dx] === '#') {
              arrayMap[y+dy][x+dx] = 'O'
            }
          }
        }
      }
    }
  }
  if (result) {
    for (let i = 0; i < map.length; i++) {
      map[i] = arrayMap[i].join('');
    }
  }
  return result;
}

function getNeighbor(part: Part, input: Part[], pos: 'right' | 'bottom'): Part | undefined {
  if (pos === 'right') {
    const sideId = part.getRightId();
    let neigh = input.find(v => (v.id !== part.id && v.getAllSideIds().includes(sideId)));
    for (let a = 0; a < 2; a++) {
      for (let i = 0; i < 4; i++) {
        const turn = neigh.rotate(i);
        if (turn.getLeftId() === sideId) {
          return turn
        }
      }
      neigh = neigh.flip();
    }
  } else if (pos === 'bottom') {
    const sideId = part.getBottomId();
    let neigh = input.find(v => (v.id !== part.id && v.getAllSideIds().includes(sideId)));
    for (let a = 0; a < 2; a++) {
      for (let i = 0; i < 4; i++) {
        const turn = neigh.rotate(i);
        if (turn.getTopId() === sideId) {
          return turn
        }
      }
      neigh = neigh.flip();
    }
  }
}

function getNeighborsMap(input: Part[]):  Map<number, number[]> {
  const map: Map<number, number[]> = new Map();
  for (const part of input) {
    for (const side of part.getAllSideIds()) {
      if (!map.has(side)) {
        map.set(side, []);
      }
      map.get(side).push(part.id);
    }
  }
  return map
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Part[]) {
  const map = getNeighborsMap(input);

  const result = [];
  for (const part of input) {
    let count = 0;
    for (const side of part.getAllSideIds()) {
      const ids = map.get(side).filter(v => v !== part.id);
      if (ids.length > 0) {
        count++;
      }
    }
    if (count <= 4) {
      result.push(part.id);
    }
  }
  return result.reduce((buff, v) => buff * v);
}

function calculatePart2(input: Part[]) {
  const map = getNeighborsMap(input);
  console.log(map);
  let firstPart: Part;
  for (const part of input) {
    let count = 0;
    for (const side of part.getAllSideIds()) {
      const ids = map.get(side).filter(v => v !== part.id);
      if (ids.length > 0) {
        count++;
      }
    }
    if (count <= 4) {
      firstPart = part;
      break;
    }
  }
  while (map.get(firstPart.getLeftId()).length !== 1 || map.get(firstPart.getTopId()).length !== 1) {
    firstPart = firstPart.rotate(1);
  }

  const result: Part[][] = [];
  const size = Math.sqrt(input.length);
  for (let y = 0; y < size; y++) {
    result[y] = [];
    for (let x = 0; x < size; x++) {
      if (x === 0 && y === 0) {
        result[y][x] = firstPart;
      } else if (y === 0) {
        result[y][x] = getNeighbor(result[y][x - 1], input, 'right');
      } else {
        result[y][x] = getNeighbor(result[y - 1][x], input, 'bottom');
      }
    }
  }

  let fullMap: string[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inner = result[y][x].getInnerImage();
      for (let i = 0; i < inner.length; i++) {
        const lineIndex = y * inner.length + i;
        if (!fullMap[lineIndex]) {
          fullMap[lineIndex] = '';
        }
        fullMap[lineIndex] += inner[i];
      }
    }
  }

  br: for (let a = 0; a < 2; a++) {
    for (let i = 0; i < 4; i++) {
      if (detectMonsters(fullMap)) {
        break br;
      }
      fullMap = rotateMap(fullMap);
    }
    fullMap = fullMap.reverse();
  }
  console.log(fullMap.join('\n'))
  return fullMap.join('').split('').filter(v => v === '#').length
}

function parse(input: string): Part[] {
  const reg = /^Tile (\d+):$/;
  return input.split('\n\n')
      .map(part => {
        const value = part.split('\n');
        const match = value[0].match(reg);
        return new Part(+match[1], value.splice(1).filter(v => v).map(v => v.split('')));
      })
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input)));
  part1Test(`Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`, 20899048083289);
  console.log('---------------------');


  part2Test(`Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`, 273);


  console.log('---------------------');
}