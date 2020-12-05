import {getInput, getTestFunction} from './helper';

const DAY = 5;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function getSeatId(seat: string): number {
  const bin = seat.replace(/[BR]/g, '1')
                  .replace(/[FL]/g, '0');
  return Number.parseInt(bin, 2);
}

function getSortedSetIds(input: string[]): number[] {
  return input
    .map(getSeatId)
    .sort((a, b) => a - b)
}

function calculatePart1(input: string[]) {
  return getSortedSetIds(input).pop();
}

function calculatePart2(input: string[]) {
  return getSortedSetIds(input)
    .find((id, i, arr) => arr[i + 1] !== id + 1)
    + 1;
}


function parse(input: string): string[] {
  return input.split('\n');
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const test = getTestFunction((input) => getSeatId(input));
  test(`FBFBBFFRLR`, 357);
  test(`BFFFBBFRRR`, 567);
  test(`FFFBBBFRRR`, 119);
  test(`BBFFBBFRLL`, 820);

  console.log('---------------------');
}
