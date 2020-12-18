import {getInput, getTestFunction} from './helper';

const DAY = 18;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function findClose(input: string, pos: number): number {
  let counter = 1;
  while (counter > 0) {
    pos++;
    if (input[pos] === '(') {
      counter++;
    } else if (input[pos] === ')') {
      counter--;
    }
  }
  return pos;
}

function exec(input: string, priority?: '+' | '*'): number {
  let result = 0;
  let pos = 0;
  let action = '+'
  while (pos < input.length) {
    const value = input[pos];
    if (value === '(') {
      const close = findClose(input, pos);
      const sub = input.slice(pos + 1, close);
      if (action === '+') {
        result += exec(sub, priority);
      } else {
        result *= exec(sub, priority);
      }
      pos = close + 1;
    } else if (value === '+' || value === '*') {
      if (priority && value !== priority) {
        return value === '+' ? result + exec(input.slice(pos + 1), priority) : result * exec(input.slice(pos + 1), priority)
      } else {
        action = value;
        pos++;
      }
    } else if (value === '*') {
      action = '*';
      pos++;
    } else {
      if (action === '+') {
        result += +value;
      } else {
        result *= +value;
      }
      pos++;
    }
  }

  return result;
}

function calculatePart1(input: string[]) {
  return input.map(v => v.replace(/ /g, ''))
      .map(v => exec(v))
      .reduce((buf, v) => buf + v)
}

function calculatePart2(input: string[]) {
  return input.map(v => v.replace(/ /g, ''))
      .map(v => exec(v, '+'))
      .reduce((buf, v) => buf + v)
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
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input)));
  part1Test(`1 + (2 * 3) + (4 * (5 + 6))`, 51);
  part1Test(`2 * 3 + (4 * 5)`, 26);
  part1Test(`5 + (8 * 3 + 9 + 3 * 4 * 3)`, 437);
  part1Test(`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`, 12240);
  part1Test(`((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`, 13632);
  console.log('---------------------');


  part2Test(`1 + 2 * 3 + 4 * 5 + 6`, 231);
  part2Test(`1 + (2 * 3) + (4 * (5 + 6))`, 51);
  part2Test(`2 * 3 + (4 * 5)`, 46);
  part2Test(`5 + (8 * 3 + 9 + 3 * 4 * 3)`, 1445);
  part2Test(`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`, 669060);
  part2Test(`((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`, 23340);


  console.log('---------------------');
}
