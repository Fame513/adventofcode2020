import {getInput, getTestFunction} from './helper';

const DAY = 9;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: number[], range: number) {
  loop: for (let i = 0; i < input.length - range; i++) {
    const slice = input.slice(i, i + range);
    const expected = input[i + range];
    for (let a = 0; a < slice.length - 1; a++) {
      for (let b = a + 1; b < slice.length; b++) {
        if (slice[a] + slice[b] === expected) {
          continue loop;
        }
      }
    }
    return expected;
  }
}

function calculatePart2(input: number[], range: number) {
  const expected = calculatePart1(input, range);
  for (let length = 2; length < input.length; length++) {
    for (let i = 0; i < input.length - length; i++) {
      const slice = input.slice(i, i + length);
      const sum = slice.reduce((res, v) => res + v);
      if (sum === expected) {
        return Math.max(...slice) + Math.min(...slice);
      }
    }
  }
}


function parse(input: string): number[] {
  return input.split('\n')
      .map(value => +value);
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input), 25);
  const result2 = calculatePart2(parse(input), 25);
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input), 5));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input), 5));
  part1Test(`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`, 127);

  console.log('---------------------');

  part2Test(`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`, 62);

  console.log('---------------------');
}
