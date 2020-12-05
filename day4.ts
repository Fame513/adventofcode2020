import {getInput, getTestFunction} from './helper';

const DAY = 4;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Map<string, string>[]): number {
  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  let count = 0;
  pas: for (const passport of input) {
    for (const filed of requiredFields) {
      if (!passport.has(filed)) {
        continue pas;
      }
    }
    count++
  }
  return count;
}

function calculatePart2(input: Map<string, string>[]) {
  const rules = [
    {
      key: 'byr',
      validator: val => /\d{4}/.test(val) && +val >= 1920 && +val <= 2002
    },
    {
      key: 'iyr',
      validator: val => /\d{4}/.test(val) && +val >= 2010 && +val <= 2020
    },
    {
      key: 'eyr',
      validator: val => /\d{4}/.test(val) && +val >= 2020 && +val <= 2030
    },
    {
      key: 'hgt',
      validator: val => /^\d+cm$/.test(val) ? (parseInt(val) >= 150 && parseInt(val)  <= 193) :
                        /^\d+in$/.test(val) ? (parseInt(val) >= 59 && parseInt(val)  <= 76) :
                        false
    },
    {
      key: 'hcl',
      validator: val => /^#[0-9a-f]{6}$/.test(val)
    },
    {
      key: 'ecl',
      validator: val => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(val) >= 0
    },
    {
      key: 'pid',
      validator: val => /^[0-9]{9}$/.test(val)
    },
  ];

  let count = 0;
  pas: for (const passport of input) {
    for (const rule of rules) {
      const val = passport.get(rule.key);
      if (val == undefined || !rule.validator(val)) {
        continue pas;
      }
    }
    count++
  }
  return count;
}


function parse(input: string): Map<string, string>[] {
  return input.split('\n\n')
    .map(row => row.split(/[ \n]/)
      .map(item => item.split(':') as [string, string])
    ).map(item => new Map<string, string>(item));
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
  part1Test(`ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`, 2);

  console.log('---------------------');

  part2Test(`eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`, 0);

  part2Test(`pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`, 4);

  console.log('---------------------');
}
