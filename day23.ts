import {getInput, getTestFunction} from './helper';

const DAY = 23;

class List {
  value: number;
  next: List;
  prev: List;

  constructor(value: number) {
    this.value = value;
    this.next = this;
    this.prev = this;
  }

  add(value: number): List {
    const newItem = new List(value);
    newItem.prev = this;
    newItem.next = this.next
    this.next = newItem;
    newItem.next.prev = newItem;
    return newItem;
  }

  remove(index: number = 0, count: number = 1): List {
    let first: List = this;
    for (let i = 0; i < index; i++) {
      first = first.next
    }
    let last: List = first;
    for (let i = 1; i < count; i++) {
      last = last.next;
      if (last === first) {
        last = last.prev;
        break;
      }
    }

    first.prev.next = last.next;
    last.next.prev = first.prev;
    first.prev = last;
    last.next = first;
    return first;
  }

  insert(list: List) {
    list.prev.next = this.next;
    this.next.prev = list.prev;
    list.prev = this;
    this.next = list;
  }

  find(value: number): List | undefined {
    if (this.value === value) {
      return this;
    }
    const start = this;
    let result: List = start.next;
    while (result.value !== value && result !== start) {
      result = result.next
    }
    return result.value === value ? result : undefined;
  }
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: List, moves: number) {
  let current = input;
  for (let i = 0; i < moves; i++) {
    const sub = current.remove(1, 3);
    let findValue = current.value - 1;
    let insertAfter: List;
    while (!insertAfter) {
      if (findValue === 0) {
        findValue = 9;
      }
      insertAfter = current.find(findValue);
      findValue--;
    }
    insertAfter.insert(sub);
    current = current.next;
  }

  let item = current.find(1);
  let result = '';
  while (item.next.value !== 1) {
    result += item.next.value;
    item = item.next;
  }
  return result;
}

function calculatePart2(input: List) {
  const moves = 10000000;
  const map: Map<number, List> = new Map();
  let curr = input
  for (let i = 0; i < 9; i++) {
    map.set(curr.value, curr);
    curr = curr.next;
  }
  for (let i = 10; i <= 1000000; i++) {
    map.set(i, input.prev.add(i));
  }
  let current = input;
  for (let i = 0; i < moves; i++) {
    const sub = current.remove(1, 3);
    let findValue = current.value - 1;
    for (let i = 0; i < 3; i++) {
      if (findValue === 0) {
        findValue = 1000000;
      }
      if (sub.find(findValue)) {
        findValue--;
      }
    }
    if (findValue === 0) {
      findValue = 1000000;
    }
    let insertAfter: List = map.get(findValue);
    insertAfter.insert(sub);
    current = current.next;
  }

  let item = current.find(1);

  return item.next.value * item.next.next.value;
}

function parse(input: string): List {
  const numbers: number[] = input.split('').map(v => +v);
  const result = new List(numbers[0]);
  for (let i = 1; i < numbers.length; i++) {
    result.prev.add(numbers[i]);
  }
  return result;
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input), 100);
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input), 100));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input)));
  part1Test(`389125467`, '67384529');
  console.log('---------------------');


  part2Test(`389125467`, 149245887792);


  console.log('---------------------');
}