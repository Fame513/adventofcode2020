import {getInput, getTestFunction} from './helper';

const DAY = 13;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1({time, schedule}: {time: number, schedule: number[]}) {
  const result = schedule
      .filter(v => !isNaN(v))
      .map(id => ({next: id - (time % id), id}))
      .reduce((min, v) => v.next < min.next ? v : min);
  return result.id * result.next;
}

function calculatePart2({schedule}: {time: number, schedule: number[]}) {
  const info = Array.from(schedule.entries())
      .filter(([key, value]) => !isNaN(value))
      .map(([key, value]) => ({dif: key, value}))
      .sort((a, b) => b.value - a.value);

  let time = 0, success = [];
  while (success.length !== info.length) {
    time += success.reduce((res, v) => v.value * res, 1);
    success = info.filter(bus => (time + bus.dif) % bus.value === 0);
  }
  return time
}

function parse(input: string): {time: number, schedule: number[]} {
  const lines = input.split('\n');
  const time = +lines[0];
  const schedule = lines[1].split(',')
      .map(value => +value);
  return {time, schedule};
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
  part1Test(`939
7,13,x,x,59,x,31,19`, 295);
  console.log('---------------------');


  part2Test(`0
7,13,x,x,59,x,31,19`, 1068781);

  part2Test(`0
17,x,13,19`, 3417);

  part2Test(`0
67,7,59,61`, 754018);

  part2Test(`0
67,x,7,59,61`, 779210);

  part2Test(`0
67,7,x,59,61`, 1261476);

  part2Test(`0
1789,37,47,1889`, 1202161486);

  console.log('---------------------');
}