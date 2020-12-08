import {getInput, getTestFunction} from './helper';

const DAY = 8;

type Command = {
  command: string;
  value: number;
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculate(input: Command[]) {
  let i = 0;
  const executedSet: Set<number> = new Set();
  let accumulator = 0;
  while (true) {
    if (executedSet.has(i)) {
      return [accumulator, false];
    }
    if (i >= input.length) {
      return [accumulator, true];
    }
    executedSet.add(i);
    const command = input[i];
    switch (command.command) {
      case 'acc':
        accumulator += command.value;
        i++;
        break;
      case 'jmp':
        i += command.value;
        break;
      case 'nop':
      default:
        i++
    }
  }
}

function switchCommand(command: Command): boolean {
  if (command.command === 'jmp') {
    command.command = 'nop';
    return true
  }
  if (command.command === 'nop') {
    command.command = 'jmp';
    return true
  }
  return false;
}

function calculatePart1(input: Command[]) {
  const [result] = calculate(input);
  return result;
}

function calculatePart2(input:  Command[]) {
  for (const command of input) {
    if (switchCommand(command)) {
      const [result, isCorrect] = calculate(input);
      if (isCorrect) {
        return result;
      }
      switchCommand(command);
    }
  }
}


function parse(input: string): Command[] {
  return input.split('\n')
      .map(row => row.split(' '))
      .map(([command, value]) => ({command, value: +value}))

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
  part1Test(`nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`, 5);

  console.log('---------------------');

  part2Test(`nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`, 8);

  console.log('---------------------');
}
