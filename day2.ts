import {getInput, getTestFunction} from './helper';

const DAY = 2;

class Password {
  password: string;
  min: number;
  max: number;
  letter: string;

  constructor(password: string, min: number, max: number, letter: string) {
    this.password = password;
    this.min = min;
    this.max = max;
    this.letter = letter;
  }

  isValid(): boolean {
    let count = 0;
    for (const char of this.password.split('')) {
      if (char === this.letter) {
        count++
      }
    }
    return count >= this.min && count <= this.max;
  }

  isValid2(): boolean {
    const firstPos = this.password.charAt(this.min - 1) === this.letter;
    const lastPos = this.password.charAt(this.max - 1) === this.letter;
    return (firstPos || lastPos) && !(firstPos && lastPos);
  }
}


tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Password[]) {
  return input.filter(password => password.isValid()).length;
}

function calculatePart2(input: Password[]) {
  return input.filter(password => password.isValid2()).length;

}


function parse(input: string): Password[] {
  const regexp = /^(\d+)-(\d+) (.): (.*)$/;
  return input.split('\n')
    .map(row => row.match(regexp))
    .map(val => new Password(val[4], +val[1], +val[2], val[3]))
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
  part1Test(`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`, 2);

  console.log('---------------------');

  part2Test(`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`, 1);

  console.log('---------------------');
}
