import { dirname, join } from "@std/path";

import Pars from "parsimmon";
import { match } from "ts-pattern";
import { function as F, array as A } from "fp-ts";

import { remEuclid } from "../shared/math.ts";

export function solvePart1(input: string): number {
  const direction = Pars.alt(Pars.string("L"), Pars.string("R"));
  const number = Pars.digits.map(Number);
  const turn = Pars.seq(direction, number).map(([direction, number]) => {
    return {
      direction,
      number,
    };
  });
  const parser = turn.sepBy(Pars.newline.or(Pars.eof));

  const turns = parser.parse(input);

  if (!turns.status) {
    throw new Error("Failed to parse input");
  }

  const turnsList = turns.value;

  const result = F.pipe(
    turnsList,
    A.scanLeft(50, (acc, val) => {
      return match(val)
        .with({ direction: "L" }, (val) => remEuclid(acc - val.number, 100))
        .with({ direction: "R" }, (val) => remEuclid(acc + val.number, 100))
        .exhaustive();
    }),
    A.filter((val) => val === 0),
    A.size
  );

  return result;
}

async function main() {
  const input = await Deno.readTextFile(
    join(dirname(new URL(import.meta.url).pathname), "input.txt")
  );
  console.log(solvePart1(input.trim()));
}

main();
