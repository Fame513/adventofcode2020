import {getInput, getTestFunction} from './helper';

const DAY = 15;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculate(input: number[], index: number) {

  const map: Map<number, number> = new Map<number, number>();
  for (let i = 0; i < input.length - 1; i++) {
    map.set(input[i], i + 1);
  }
  let last = input[input.length - 1];
  for (let i = input.length ; i < index; i++) {
    const beforeLastIndex = map.get(last);
    map.set(last, i);
    last = beforeLastIndex == null ? 0 : i - beforeLastIndex
  }
  return last;
}

function parse(input: string): number[] {
  return input.split(',').map(v => +v);
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculate(parse(input), 2020);
  const result2 = calculate(parse(input), 30000000);
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculate(parse(input), 2020));
  const part2Test = getTestFunction((input) => calculate(parse(input), 30000000));
  part1Test(`0,3,6`, 436);
  part1Test(`1,3,2`, 1);
  part1Test(`2,1,3`, 10);
  part1Test(`1,2,3`, 27);
  part1Test(`2,3,1`, 78);
  part1Test(`3,2,1`, 438);
  part1Test(`3,1,2`, 1836);
  console.log('---------------------');

  part2Test(`0,3,6`, 175594);
  part2Test(`1,3,2`, 2578);
  part2Test(`2,1,3`, 3544142);
  part2Test(`1,2,3`, 261214);
  part2Test(`2,3,1`, 6895259);
  part2Test(`3,2,1`, 18);
  part2Test(`3,1,2`, 362);

  console.log('---------------------');
}