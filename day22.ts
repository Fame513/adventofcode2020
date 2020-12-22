import {getInput, getTestFunction} from './helper';

const DAY = 22;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function getWinner(player1: number[], player2: number[]): number {
  const steps: Set<string> = new Set();

  while (player1.length && player2.length) {
    steps.add(player1.join(',') + ':' + player2.join(','));
    const card1 = player1.shift();
    const card2 = player2.shift();
    let winner = card1 > card2 ? 1 : 2;
    if (card1 <= player1.length && card2 <= player2.length) {
      winner = getWinner(player1.slice(0, card1), player2.slice(0, card2));
    }
    if (winner === 1) {
      player1.push(card1, card2)
    } else {
      player2.push(card2, card1)
    }
    const step = player1.join(',') + ':' + player2.join(',');
    if (steps.has(step)) {
      return 1;
    }
  }

  return player1.length ? 1 : 2;
}

function calculatePart1({player1, player2}: {player1: number[], player2: number[]}) {
  while (player1.length && player2.length) {
    const card1 = player1.shift();
    const card2 = player2.shift();
    if (card1 > card2) {
      player1.push(card1, card2)
    } else {
      player2.push(card2, card1)
    }
  }

  const winner = player1.length ? player1 : player2;
  return winner.reduce((buf, val, i) => buf + (val * (winner.length - i)), 0)
}

function calculatePart2({player1, player2}:  {player1: number[], player2: number[]}) {
  while (player1.length && player2.length) {
    const card1 = player1.shift();
    const card2 = player2.shift();
    let winner = card1 > card2 ? 1 : 2;
    if (card1 <= player1.length && card2 <= player2.length) {
      winner = getWinner(player1.slice(0, card1), player2.slice(0, card2));
    }
    if (winner === 1) {
      player1.push(card1, card2)
    } else {
      player2.push(card2, card1)
    }
  }
  const winner = player1.length ? player1 : player2;
  return winner.reduce((buf, val, i) => buf + (val * (winner.length - i)), 0)
}

function parse(input: string): {player1: number[], player2: number[]} {
  const [player1String, player2String] = input.split('\n\n');
  return {
    player1: player1String.split('\n').slice(1).map(v => +v),
    player2: player2String.split('\n').slice(1).map(v => +v),
  }

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
  part1Test(`Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`, 306);
  console.log('---------------------');


  part2Test(`Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`, 291);


  console.log('---------------------');
}