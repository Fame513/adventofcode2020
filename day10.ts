import {getInput, getTestFunction} from './helper';

const DAY = 10;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function getDiff(input: number[]): number[] {
  input.sort((a, b) => a - b);
  input.unshift(0);
  return  input.map((v, i) => {
    return input[i + 1] ?
      input[i + 1] - v :
      3;
  });
}

function calculatePart1(input: number[]) {
  const diff = getDiff(input);
  return diff.filter(v => v === 1).length * diff.filter(v => v === 3).length;
}

function calculatePart2(input: number[]): number{
  const diff = getDiff(input);
  let result = 1;
  let ones = 0;
  for (let i = 0; i < diff.length; i++) {
    if (diff[i] === 3) {
      result *= calcOnes(ones) + 1;
      ones = 0;
    } else {
      ones++
    }
  }
  return result;
}

function calcOnes(ones: number): number {
  let count = (ones * (ones - 1)) / 2;
  for (let i = ones - 3; i > 0; i--) {
    count += 2 * calcOnes(i);
  }
  return count;
}


function parse(input: string): number[] {
  return input.split('\n')
      .map(value => +value);
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
  part1Test(`16
10
15
5
1
11
7
19
6
12
4`, 35);


  part1Test(`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`, 220);

  console.log('---------------------');

  part2Test(`16
10
15
5
1
11
7
19
6
12
4`, 8);


  part2Test(`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`, 19208);

  console.log('---------------------');
}
