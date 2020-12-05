import {getInput, getTestFunction} from './helper';

const DAY = 3;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: string[][], rule: {x: number, y: number} = {x: 3, y: 1}): number {
  let x = 0, y = 0;
  let result = 0;
  while (y < input.length) {
    if (input[y][x] === '#') {
      result++
    }
    x = (x + rule.x) % input[y].length;
    y += rule.y;
  }
  return result;
}

function calculatePart2(input: string[][]): number {
  const rules = [
    {x: 1, y: 1},
    {x: 3, y: 1},
    {x: 5, y: 1},
    {x: 7, y: 1},
    {x: 1, y: 2}
  ]

  return rules.map(rule => calculatePart1(input, rule))
    .reduce((res, val) => res * val);
}


function parse(input: string): string[][] {
  return input.split('\n')
    .map(row => row.split(''))
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
  part1Test(`..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`, 7);

  console.log('---------------------');

  part2Test(`..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`, 336);

  console.log('---------------------');
}
