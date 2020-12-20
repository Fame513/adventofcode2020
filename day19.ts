import {getInput, getTestFunction} from './helper';

const DAY = 19;

interface Rule {
  value?: string;
  sub?: number[][];
  values?: string[];
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function mixStrings(s: string[][], result: string[]): void {
  s = s.filter(v => v && v.length);
  const count = s.reduce((buff, v) => buff * v.length, 1);
  for (let i = 0; i < count; i++) {
    let mod = i;
    let str = '';
    for (let arr of s) {
      str += arr[mod % arr.length]
      mod = Math.floor(mod / arr.length);
    }
    result.push(str);
  }
}

function getList(rules: Map<number, Rule>, rule?: Rule): string[] {
  if (!rule) {
    return [];
  }
  if (rule.value) {
    return [rule.value];
  }
  if (rule.values) {
    return rule.values;
  }
  const result = [];
  for (const r of rule.sub) {
    mixStrings(r.map(v => getList(rules, rules.get(v))), result);
  }
  return rule.values = result;
}

function calculatePart1({rules, data}: {rules: Map<number, Rule>, data: string[]}) {
  const list = getList(rules, rules.get(0))
  console.log(list);
  const set = new Set(list);
  return data.filter(row => set.has(row)).length
}

function calculatePart2({rules, data}: {rules: Map<number, Rule>, data: string[]}) {
  const maxLength = Math.max(...data.map(v => v.length))
}

function parse(input: string): {rules: Map<number, Rule>, data: string[]} {
  const [rules, examples] = input.split('\n\n');
  const regexp = /^(\d+): (.*)$/
  const letterRegexp = /^(\d+): "(.)"$/
  const rulesMap: Map<number, Rule> = new Map()
  rules.split('\n').map(rule => {
    const letterMatch = rule.match(letterRegexp);
    const match = rule.match(regexp);
    if (letterMatch) {
      return rulesMap.set(+letterMatch[1], {value: letterMatch[2]});
    } else {
      const varians = match[2];
      const sub = varians.split(' | ').map(v => v.split(' ').map(v => +v))
      return rulesMap.set(+match[1], {sub});
    }
  })
  return {rules: rulesMap, data: examples.split('\n')};
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
  part1Test(`0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`, 2);

  part1Test(`42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`, 3);
  console.log('---------------------');
//
//
//   part2Test(`42: 9 14 | 10 1
// 9: 14 27 | 1 26
// 10: 23 14 | 28 1
// 1: "a"
// 11: 42 31
// 5: 1 14 | 15 1
// 19: 14 1 | 14 14
// 12: 24 14 | 19 1
// 16: 15 1 | 14 14
// 31: 14 17 | 1 13
// 6: 14 14 | 1 14
// 2: 1 24 | 14 4
// 0: 8 11
// 13: 14 3 | 1 12
// 15: 1 | 14
// 17: 14 2 | 1 7
// 23: 25 1 | 22 14
// 28: 16 1
// 4: 1 1
// 20: 14 14 | 1 15
// 3: 5 14 | 16 1
// 27: 1 6 | 14 18
// 14: "b"
// 21: 14 1 | 1 14
// 25: 1 1 | 1 14
// 22: 14 14
// 8: 42
// 26: 14 22 | 1 20
// 18: 15 15
// 7: 14 5 | 1 21
// 24: 14 1
//
// abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
// bbabbbbaabaabba
// babbbbaabbbbbabbbbbbaabaaabaaa
// aaabbbbbbaaaabaababaabababbabaaabbababababaaa
// bbbbbbbaaaabbbbaaabbabaaa
// bbbababbbbaaaaaaaabbababaaababaabab
// ababaaaaaabaaab
// ababaaaaabbbaba
// baabbaaaabbaaaababbaababb
// abbbbabbbbaaaababbbbbbaaaababb
// aaaaabbaabaaaaababaa
// aaaabbaaaabbaaa
// aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
// babaaabbbaaabaababbaabababaaab
// aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`, 12);


  console.log('---------------------');
}