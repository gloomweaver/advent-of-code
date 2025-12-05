import { dirname, join } from "jsr:@std/path@1.1.3";

/// <reference types="npm:@types/parsimmon" />
import Pars from "npm:parsimmon@1.18.1";
import { match } from "npm:ts-pattern@5.9.0";
import { function as F, array as A } from "npm:fp-ts@2.16.11";

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
