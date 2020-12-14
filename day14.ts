import {getInput, getTestFunction} from './helper';

const DAY = 14;

class Command {
  mem: number;
  value: number;
  mask: string

  constructor(mask: string, mem: number, value: number) {
    this.mem = mem;
    this.value = value;
    this.mask = mask;
  }

  exec(buffer: Map<number, number>) {
    const bitValue = this.value.toString(2).padStart(36, '0');
    const bitResult = this.mask.split('').map((char, i) => {
      return char === 'X' ? bitValue[i] : char;
    }).join('');
    const result = parseInt(bitResult, 2);
    buffer.set(this.mem, result);
  }

  execV2(buffer: Map<number, number>) {
    const xCount = this.mask.split('').filter(v => v === 'X').length;
    for (let i = 0; i < Math.pow(2, xCount); i++) {
      const iBit = i.toString(2).padStart(xCount, '0');
      let pos = 0;
      const memBit = this.mem.toString(2).padStart(36, '0');
      const address = this.mask.split('').map((char, i) => {
        if (char === '1') {
          return '1'
        }
        if (char === '0') {
          return  memBit[i];
        }
        return iBit[pos++];
      }).join('')
      buffer.set(Number.parseInt(address, 2), this.value);
    }
  }
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Command[]) {
  const mem: Map<number, number> = new Map();
  input.forEach(command => command.exec(mem));
  return Array.from(mem.values()).reduce((buf, v) => buf + v);
}

function calculatePart2(input: Command[]) {
  const mem: Map<number, number> = new Map();
  input.forEach(command => command.execV2(mem));
  return Array.from(mem.values()).reduce((buf, v) => buf + v);
}

function parse(input: string): Command[] {
  const maskReg = /^mask = (.*)$/;
  const memReg = /mem\[(\d+)\] = (\d+)$/
  const result: Command[] = [];
  let mask = '';
  input.split('\n')
  .forEach(line => {
    if (maskReg.test(line)) {
      mask = line.match(maskReg)[1];
    } else {
      const match = line.match(memReg);
      result.push(new Command(mask, +match[1], +match[2]));
    }
  })
  return result;
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
  part1Test(`mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`, 165);
  console.log('---------------------');


  part2Test(`mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`, 208);


  console.log('---------------------');
}