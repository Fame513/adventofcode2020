import {getInput, getTestFunction} from './helper';

const DAY = 7;

class Bag {
  contain: {bag: string, count: number}[] = [];
  constructor(public name: string) {
  }
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Map<string, Bag>) {
  const doneSet = new Set(['shiny gold'])
  const bugList: string[] = ['shiny gold']
  let result = 0;
  while (bugList.length) {
    const bagName = bugList.shift();
    for (const bag of input.values()) {
      for (const subBag of bag.contain) {
        if (subBag.bag === bagName && !doneSet.has(bag.name)) {
          bugList.push(bag.name);
          result++;
          doneSet.add(bag.name)
        }
      }
    }
  }
  return result;
}

function getBagsCount(input: Map<string, Bag>, bagName: string): number {
  let count = 0;
  const bag = input.get(bagName);
  for (let subBag of bag.contain) {
    count += subBag.count + (subBag.count * getBagsCount(input, subBag.bag));
  }
  return count;
}

function calculatePart2(input) {
  return getBagsCount(input, 'shiny gold');
}


function parse(input: string) {
  const regexp = /^(.+) bags contain (.*)\./;
  const subRegexp = /^(\d+) (.*) bags?$/;
  const bagsMap: Map<string, Bag> = new Map();
  input.split('\n')
    .map(row => row.match(regexp))
    .forEach(parsed => {
      const bag = new Bag(parsed[1])
      const childrenParse = parsed[2].split(', ');
      if (childrenParse[0] !== 'no other bags') {
        childrenParse.forEach(sub => {
          const subParsed = sub.match(subRegexp);
          bag.contain.push({count: +subParsed[1], bag: subParsed[2]})
        })
      }
      bagsMap.set(bag.name, bag);
    });
  return bagsMap;
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
  part1Test(`light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`, 4);

  console.log('---------------------');

  part2Test(`light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`, 32);

  part2Test(`shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`, 126);

  console.log('---------------------');
}
