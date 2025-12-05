import { assertEquals } from "@std/assert";

import { solvePart2 } from "./part-2.ts";

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
  assertEquals(solvePart2(input), 6);
});
