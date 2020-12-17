import {getInput, getTestFunction} from './helper';

const DAY = 17;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function getCords(value: string): number[] {
  return value.split(':').map(v => +v);
}

function cordsToString(...coords: number[]): string {
  return coords.join(':');
}

function getNeighbors(point: string): Set<string> {
  const neighbors: Set<string> = new Set();

  const coords = getCords(point);
  const dim = coords.length;
  for (let i = 0; i < Math.pow(3, dim); i++) {
    const base3 = i.toString(3).padStart(dim, '0');
    if (base3 === '1'.repeat(dim)) {
      continue;
    }
    const neighborPos = coords.map((v, i) => v + (+base3[i] - 1));
    neighbors.add(cordsToString(...neighborPos));
  }

  return neighbors
}

function checkPoint(point: string, state: Set<string>): boolean {
  const neighbors = getNeighbors(point);
  const activeCount = Array.from(neighbors).filter(neighbor => state.has(neighbor)).length;

  return state.has(point) ?
    (activeCount >= 2 && activeCount <= 3) :
    (activeCount === 3)
}

function step(state: Set<string>): Set<string> {
  const allNeighbors: Set<string> = new Set();
  state.forEach(v => getNeighbors(v).forEach(point => allNeighbors.add(point)));
  const allPointsToCheck = new Set([...Array.from(state), ...Array.from(allNeighbors)]);
  const newState: Set<string> = new Set();
  allPointsToCheck.forEach(point => {
    if (checkPoint(point, state)) {
      newState.add(point);
    }
  })

  return newState;
}

function calculatePart1(input: Set<string>) {
  let state = new Set(Array.from(input).map(v => v + ':0'));
  for(let i = 0; i < 6; i++) {
    state = step(state);
  }
  return state.size;
}

function calculatePart2(input: Set<string>) {
  let state = new Set(Array.from(input).map(v => v + ':0:0'));
  for(let i = 0; i < 6; i++) {
    state = step(state);
  }
  return state.size;
}

function parse(input: string): Set<string> {
  const result: Set<string> = new Set();
  const rows = input.split('\n');
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] === '#') {
        result.add(cordsToString(x, y));
      }
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
###`, 848);


  console.log('---------------------');
}
