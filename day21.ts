import {getInput, getTestFunction} from './helper';

const DAY = 21;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function determinate(input: {ingredients: string[], allergens: string[]}[]): Map<string, string> {
  const determin: Map<string, string> = new Map<string, string>();
  const map: Map<string, string[][]> = new Map<string, string[][]>();
  for (const food of input) {
    for (const allergen of food.allergens) {
      if (!map.has(allergen)) {
        map.set(allergen, []);
      }
      map.get(allergen).push(food.ingredients);
    }
  }

  while (determin.size !== map.size) {
    for (const [alergen, allFood] of map.entries()) {
      if (Array.from(determin.values()).includes(alergen)) {
        continue;
      }
      const counterMap: { [key: string]: number } = {};
      for (const food of allFood) {
        for (const ingr of food) {
          if (!counterMap[ingr]) {
            counterMap[ingr] = 0;
          }
          if (!determin.has(ingr)) {
            counterMap[ingr]++;
          }
        }
      }
      const posible = Object.entries(counterMap)
          .filter(([ingr, count]) => count === allFood.length)
          .map(([ingr, count]) => ingr);
      if (posible.length === 1) {
        determin.set(posible[0], alergen);
      }
    }
  }
  return determin;
}

function calculatePart1(input: {ingredients: string[], allergens: string[]}[]) {
  const determin = determinate(input);

  return input.map(v => v.ingredients.filter(ing => !determin.has(ing)).length)
      .reduce((buff, v) => buff + v)
}

function calculatePart2(input: {ingredients: string[], allergens: string[]}[]){
  const determin = determinate(input);
  return Array.from(determin.entries()).sort((a, b) => {
    return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
  }).map(v => v[0])
      .join(',');
}

function parse(input: string): {ingredients: string[], allergens: string[]}[] {
  const reg = /(.*) \(contains (.*)\)/
  return input.split('\n').map(row => {
    const match = row.match(reg);
    return {
      ingredients: match[1].split(' '),
      allergens: match[2].split(', '),
    }
  })
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
  part1Test(`mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`, 5);
  console.log('---------------------');


  part2Test(`mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`, 'mxmxvkd,sqjhc,fvjkl');


  console.log('---------------------');
}