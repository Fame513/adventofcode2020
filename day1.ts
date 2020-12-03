import {getInput, getTestFunction} from './helper';

const DAY = 1;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: number[]) {
  for(const a of input) {
    for (const b of input) {
      if (a + b === 2020) {
        return a * b;
      }
    }
  }
}

function calculatePart2(input: number[]) {
  for(const a of input) {
    for (const b of input) {
      for (const c of input) {
        if (a + b + c === 2020) {
          return a * b * c;
        }
      }
    }
  }
}


function parse(input: string): number[] {
  return input.split('\n')
    .map(row => +row)
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(input));
  const part2Test = getTestFunction((input) => calculatePart2(input));
  part1Test([1721, 979, 366, 299, 675, 1456], 514579);

  console.log('---------------------');

  part2Test([1721, 979, 366, 299, 675, 1456], 241861950);

  console.log('---------------------');
}
