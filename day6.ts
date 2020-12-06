import {getInput, getTestFunction} from './helper';

const DAY = 6;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function getStatisticMap(group: string[]): {[key: string]: number} {
  const groupResult: {[key: string]: number} = {};
  for (const person of group) {
    for (const answer of person.split('')) {
      if (!groupResult[answer]) {
        groupResult[answer] = 0;
      }
      groupResult[answer] ++;
    }
  }
  return groupResult;
}

function calculatePart1(input: string[][]) {
  return input
    .map(getStatisticMap)
    .map(Object.keys)
    .map(v => v.length)
    .reduce((result, length ) => result + length);
}

function calculatePart2(input: string[][]) {
  let result = 0;
  for (const group of input) {
    const map = getStatisticMap(group);
    result += Object.values(map)
      .filter(v => v === group.length)
      .length;
  }
  return result;
}


function parse(input: string): string[][] {
  return input.split('\n\n')
    .map(row => row.split('\n'));
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
  part1Test(`abc

a
b
c

ab
ac

a
a
a
a

b`, 11);

  console.log('---------------------');

  part2Test(`abc

a
b
c

ab
ac

a
a
a
a

b`, 6);

  console.log('---------------------');
}
