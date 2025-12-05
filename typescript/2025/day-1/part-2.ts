import { dirname, join } from "@std/path";

import Pars from "parsimmon";
import { match } from "ts-pattern";
import { function as F, array as A } from "fp-ts";

import { remEuclid } from "../shared/math.ts";

export function solvePart2(input: string): number {
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
    A.reduce([50, 0] as [number, number], ([pos, count], val) => {
      return match(val)
        .with({ direction: "L" }, (val) => {
          const fullCycles = Math.floor(val.number / 100);
          const newPos = remEuclid(pos - val.number, 100);
          const addAnotherCycle = pos !== 0 && (newPos === 0 || newPos > pos);
          return [newPos, count + fullCycles + (addAnotherCycle ? 1 : 0)] as [
            number,
            number
          ];
        })
        .with({ direction: "R" }, (val) => {
          const fullCycles = Math.floor(val.number / 100);
          const newPos = remEuclid(pos + val.number, 100);
          const addAnotherCycle = pos !== 0 && (newPos === 0 || newPos < pos);
          return [newPos, count + fullCycles + (addAnotherCycle ? 1 : 0)] as [
            number,
            number
          ];
        })
        .exhaustive();
    }),
    ([_, count]) => count
  );

  return result;
}

async function main() {
  const input = await Deno.readTextFile(
    join(dirname(new URL(import.meta.url).pathname), "input.txt")
  );
  console.log(solvePart2(input.trim()));
}

if (import.meta.main) {
  main();
}
