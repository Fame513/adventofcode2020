import {getInput, getTestFunction} from './helper';

const DAY = 16;

class Rule {
  name: string;
  firstFrom: number;
  firstTo: number;
  secondFrom: number;
  secondTo: number;

  constructor(rule: string) {
    const regexp = /^(.*): (\d+)-(\d+) or (\d+)-(\d+)/
    const match = rule.match(regexp);
    this.name = match[1];
    this.firstFrom = +match[2];
    this.firstTo = +match[3];
    this.secondFrom = +match[4];
    this.secondTo = +match[5];
  }

  isValid(value: number): boolean {
    return (value >= this.firstFrom && value <= this.firstTo) ||
        (value >= this.secondFrom && value <= this.secondTo)
  }
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: {rules: Rule[], myTicket: number[], tickets: number[][]}) {
  let result = 0;
  for (const ticket of input.tickets) {
    value: for (const value of ticket) {
      for (const rule of input.rules) {
        if (rule.isValid(value)) {
          continue value;
        }
      }
      result += value;
    }
  }

  return result;
}

function calculatePart2({rules, myTicket, tickets}: {rules: Rule[], myTicket: number[], tickets: number[][]}) {
  tickets.push(myTicket);

  // filter ticket for only valid ones
  tickets = tickets.filter(ticket => {
    value: for (const value of ticket) {
      for (const rule of rules) {
        if (rule.isValid(value)) {
          continue value;
        }
      }
      return false;
    }
    return true;
  })

  // create table for possible valid positions
  const resultTable: string[][] = [];
  for (const rule of rules) {
    resultTable.push([]);
    pos: for (let i = 0; i < rules.length; i++) {
      for (const ticket of tickets) {
        if (!rule.isValid(ticket[i])) {
          resultTable[resultTable.length - 1].push('.');
          continue pos;
        }
      }
      resultTable[resultTable.length - 1].push('X');
    }
  }

  // create map for ruleIndex -> ticketIndex
  const resultMap: Map<number, number> = new Map()
  while (resultMap.size < rules.length) {
    for (let i = 0; i < rules.length; i++) {
      if (resultTable[i].filter(v => v === 'X').length === 1) {
        const pos = resultTable[i].indexOf('X');
        resultMap.set(i, pos);
        for (let j = 0; j < rules.length; j++) {
          resultTable[j][pos] = '.';
        }
      }
    }
  }

  // calculate result
  return rules.map((rule, i) => {
    if (rule.name.indexOf('departure') >= 0) {
      return myTicket[resultMap.get(i)]
    }
    return 1;
  }).reduce((buf, v) => buf * v)
}

function parse(input: string): {rules: Rule[], myTicket: number[], tickets: number[][]} {
  const parts = input.split('\n\n');
  const rules = parts[0].split('\n').map(rule => new Rule(rule));
  const myTicket = parts[1].split('\n')[1].split(',').map(v => +v);
  const tickets = parts[2].split('\n').slice(1).map(row => {
    return row.split(',').map(v => +v);
  })
  return {rules, myTicket, tickets};
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
  part1Test(`class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`, 71);
  console.log('---------------------');


  part2Test(`class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`, 1);


  console.log('---------------------');
}