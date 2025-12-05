import { assertEquals } from "jsr:@std/assert@1.0.16";

import { solvePart1 } from "./part-1.ts";

Deno.test("Example 1", () => {
  const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
  assertEquals(solvePart1(input), 3);
});
