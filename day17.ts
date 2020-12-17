import {getInput, getTestFunction} from './helper';

const DAY = 17;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function getCords(value: string): [number, number, number] {
  return value.split(':').map(v => +v) as [number, number, number];
}

function cordsToString(x: number, y: number, z: number): string {
  return `${x}:${y}:${z}`;
}

function getNeighbors(point: string): Set<string> {
  const neighbors: Set<string> = new Set;

  const [x, y, z] = getCords(point);

  for (let dx = x - 1; dx <= x + 1; dx++) {
    for (let dy = y - 1; dy <= y + 1; dy++) {
      for (let dz = z - 1; dz <= z + 1; dz++) {
        if (dx !== x && dy !== y && dz !== z) {
          neighbors.add(cordsToString(x, y, z));
        }
      }
    }
  }

  return neighbors
}

function step(input: Set<string>) {

}

function calculatePart1(input: Set<string>) {

}

function calculatePart2(input: Set<string>) {

}

function parse(input: string): Set<string> {
  const result: Set<string> = new Set();
  const rows = input.split('\n');
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      result.add(cordsToString(x, y, 0));
    }
  }
  return result;
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
  part1Test(`.#.
..#
###`, 112);
  console.log('---------------------');


  part2Test(`.#.
..#
###`, 1);


  console.log('---------------------');
}