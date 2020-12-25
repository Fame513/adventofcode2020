import {getInput, getTestFunction} from './helper';

const DAY = 25;

tests();
run().then(([result1]) => {
  console.log('Part 1:', result1);
});

function calculatePart1({door, key}: {door: number, key: number}) {
  const div = 20201227;
  const k = 7;
  let doorPub: number = 0;
  let keyPub: number = 0;
  for (let temp = 1; temp !== door; temp = (temp * k) % div) {
    doorPub++;
  }
  for (let temp = 1; temp !== key; temp = (temp * k) % div) {
    keyPub++;
  }

  let result = door;
  for (let i = 1; i < keyPub; i++) {
    result = (result * door) % div;
  }

  return result

}

function parse(input: string): {door: number, key: number} {
  const [door, key] = input.split('\n').map(v => +v);
  return {door, key};
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  return [result1]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  part1Test(`5764801
17807724`, 14897079);
  console.log('---------------------');
}