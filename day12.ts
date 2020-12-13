import {getInput, getTestFunction} from './helper';

const DAY = 12;


const DIR = {E: [1, 0], S: [0, 1], W: [-1, 0], N: [0, -1]};
const TURN_DIR = {R: 1, L: -1};

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

//             y=-1
//       _______________
//      |       N       |
//      |       |       |
// x=-1 |  W<---o--->E  | x=+1
//      |       |       |
//      |       S       |
//       ----------------
//             y=+1

function calculatePart1(input: {dir: string, value: number}[]) {
  const POS = [0, 0];
  const TURNS = [DIR.E, DIR.S, DIR.W, DIR.N];
  let TURN = 0;

  for (const step of input) {
    if (DIR[step.dir]) {
      POS[0] += DIR[step.dir][0] * step.value;
      POS[1] += DIR[step.dir][1] * step.value;
    } else if (TURN_DIR[step.dir]) {
      TURN += (step.value / 90) * TURN_DIR[step.dir];
      TURN = (TURN + TURNS.length) % TURNS.length;
    } else if (step.dir === 'F') {
      POS[0] += TURNS[TURN][0] * step.value;
      POS[1] += TURNS[TURN][1] * step.value;
    }
  }
  return Math.abs(POS[0]) + Math.abs(POS[1]);
}

function calculatePart2(input: {dir: string, value: number}[]) {
  const POS = [0, 0];
  const WP = [10, -1];

  for (const step of input) {
    if (DIR[step.dir]) {
      WP[0] += DIR[step.dir][0] * step.value;
      WP[1] += DIR[step.dir][1] * step.value;
    } else if (TURN_DIR[step.dir]) {
      const t = (step.value / 90 * TURN_DIR[step.dir] + 4) % 4;
      for (let i = 0; i < t; i++) {
        const tempX = WP[0];
        WP[0] = -WP[1];
        WP[1] = tempX;
      }
    } else if (step.dir === 'F') {
      POS[0] += WP[0] * step.value;
      POS[1] += WP[1] * step.value;
    }
  }
  return Math.abs(POS[0]) + Math.abs(POS[1]);
}

function parse(input: string): {dir: string, value: number}[] {
  return input.split('\n')
      .map(value => ({dir: value[0], value: +value.slice(1)}));
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
  part1Test(`F10
N3
F7
R90
F11`, 25);
  console.log('---------------------');


  part2Test(`F10
N3
F7
R90
F11`, 286);

  console.log('---------------------');
}
