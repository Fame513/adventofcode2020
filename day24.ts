import {getInput, getTestFunction} from './helper';

const DAY = 24;

const oddRow = {e: [1, 0], w: [-1, 0], ne: [1, -1],
  nw: [0, -1], se: [1, 1], sw: [0, 1]
}

const evenRow = {e: [1, 0], w: [-1, 0], ne: [0, -1],
  nw: [-1, -1], se: [0, 1], sw: [-1, 1]
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function tileToString(value: [number, number]): string {
  return value.join(',')
}

function strToTile(value: string): [number, number] {
  return value.split(',').map(v  => +v) as [number, number];
}

function getNeigh(tile: [number, number]): [number, number][] {
  const rule = tile[1] % 2 ? oddRow : evenRow;
  return [
      [tile[0] + rule.e[0], tile[1] + rule.e[1]],
      [tile[0] + rule.w[0], tile[1] + rule.w[1]],
      [tile[0] + rule.ne[0], tile[1] + rule.ne[1]],
      [tile[0] + rule.nw[0], tile[1] + rule.nw[1]],
      [tile[0] + rule.se[0], tile[1] + rule.se[1]],
      [tile[0] + rule.sw[0], tile[1] + rule.sw[1]],
  ]
}

function needToFlip(tiles: {[ket: string]: number}, tileStr: string): boolean {
  const tile = strToTile(tileStr);
  const neigh = getNeigh(tile);
  const blackNeigh = neigh.map(v => tileToString(v)).map(v => tiles[v] || 0).filter(v => v % 2).length;

  if (tiles[tileStr] % 2) {
    return blackNeigh === 0 || blackNeigh > 2;
  } else {
    return blackNeigh === 2;
  }
}

function getTile(path: string[]): [number, number] {


  const tile: [number, number] = [0, 0];
  for (const dir of path) {
    const rule = tile[1] % 2 ? oddRow : evenRow;
    tile[0] += rule[dir][0];
    tile[1] += rule[dir][1];

  }
  return tile;
}

function calculatePart1(input: string[][]) {
  const tiles: {[ket: string]: number} = {};
  for (const row of input) {
    const tile = getTile(row);
    const id = tileToString(tile);
    if (!tiles[id]) {
      tiles[id] = 0;
    }
    tiles[id]++;
  }

  return Object.values(tiles).filter(v => v % 2).length;
}

function calculatePart2(input: string[][]) {
  const tiles: {[ket: string]: number} = {};
  for (const row of input) {
    const tile = getTile(row);
    const id = tile.join(',');
    if (!tiles[id]) {
      tiles[id] = 0;
    }
    tiles[id]++;
  }

  for (let i = 0; i < 100; i++) {
    const tilesToCheck: Set<string> = new Set();

    Object.keys(tiles).forEach(v => {
      tilesToCheck.add(v);
      if (tiles[v] % 2) {
        const tile = strToTile(v);
        const neigh = getNeigh(tile);
        neigh.forEach(n => {
          tilesToCheck.add(tileToString(n));
        })
      }
    })

    const tilesToFlip = [];
    for (const t of tilesToCheck) {
      if (needToFlip(tiles, t)) {
        tilesToFlip.push(t);
      }
    }
    for (const t of tilesToFlip) {
      if (!tiles[t]) {
        tiles[t] = 0;
      }
      tiles[t]++;
    }
    // console.log(`Day ${i}: ${ Object.values(tiles).filter(v => v % 2).length}`)
  }
  return Object.values(tiles).filter(v => v % 2).length;
}

function parse(input: string): string[][] {
  const rows = input.split('\n');
  const result = [];
  for (const row of rows) {
    const resultRow: string[] = [];
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 's' || row[i] === 'n') {
        resultRow.push(row[i] + row[++i])
      } else {
        resultRow.push(row[i])
      }
    }
    result.push(resultRow);
  }
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
  part1Test(`sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`, 10);
  console.log('---------------------');


  part2Test(`sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`, 2208);


  console.log('---------------------');
}