import {getInput, getTestFunction} from './helper';

const DAY = 11;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function move(input: string[][], tolerance: number,
              countFunction: (input: string[][], row: number, column: number) => number): [string[][], boolean] {
  const result: string[][] = [];
  let changed = false;
  input.forEach((row, rowIndex) => {
    result[rowIndex] = [];
    row.forEach((place, columnIndex) => {
      if (place === 'L' && countFunction(input, rowIndex, columnIndex) === 0) {
        result[rowIndex][columnIndex] = '#';
        changed = true;
      } else if (place === '#' && countFunction(input, rowIndex, columnIndex) >= tolerance) {
        result[rowIndex][columnIndex] = 'L';
        changed = true;
      } else {
        result[rowIndex][columnIndex] = place;
      }
    })
  });
  return [result, changed];
}

function nearCount(input: string[][], row: number, column: number): number {
  let count = 0;
  for (let y = row - 1; y <= row + 1; y++) {
    for (let x = column - 1; x <= column + 1; x++) {
      if (y >= 0 && y < input.length &&
          x >= 0 && x < input[y].length &&
          !(y === row && x === column)
          && input[y][x] === '#') {
        count++;
      }
    }
  }
  return count;
}

function visibleCount(input: string[][], row: number, column: number): number {
  const directions = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1},
                      {x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}]
  let count = 0;
  for (const dir of directions) {
    let x = column + dir.x;
    let y = row + dir.y;
    while ( y >= 0 && y < input.length && x >= 0 && x < input[y].length) {
      if (input[y][x] === '#'){
        count++;
        break;
      }
      if (input[y][x] === 'L') {
        break
      }
      x += dir.x;
      y += dir.y
    }
  }
  return count
}

function calculatePart1(input: string[][]) {
  let changed = true;
  while (changed) {
    [input, changed] = move(input, 4, nearCount);
  }
  return input.map(row =>
    row.filter(v => v === '#').length
  ).reduce((r, v) => r + v)
}

function calculatePart2(input: string[][]) {
  let changed = true;
  while (changed) {
    [input, changed] = move(input, 5, visibleCount);
  }
  return input.map(row =>
      row.filter(v => v === '#').length
  ).reduce((r, v) => r + v)
}


function parse(input: string): string[][] {
  return input.split('\n')
      .map(value => value.split(''));
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
  part1Test(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`, 37);


  console.log('---------------------');

  part2Test(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`, 26);

  console.log('---------------------');
}
