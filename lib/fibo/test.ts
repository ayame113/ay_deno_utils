import { testing } from "../std_deps.ts";
const { assertEquals } = testing.asserts;

import { fibo } from "./mod.js";

const expect = [
  0,
  1,
  1,
  2,
  3,
  5,
  8,
  13,
  21,
  34,
  55,
  89,
  144,
  233,
  377,
  610,
  987,
  1597,
  2584,
  4181,
  6765,
  10946,
];

for (const [i, e] of expect.entries()) {
  Deno.test({
    name: `fibo ${i}`,
    fn: () => {
      assertEquals(fibo(i), e);
    },
  });
}

for (const [i, e] of expect.entries()) {
  Deno.test({
    name: `fibo ${i} (1-0 start)`,
    fn: () => {
      assertEquals(fibo(i + 1, [1, 0]), e);
    },
  });
}

const expectNegative = [
  0,
  1,
  -1,
  2,
  -3,
  5,
  -8,
  13,
  -21,
  34,
  -55,
];

for (const [i, e] of expectNegative.entries()) {
  Deno.test({
    name: `fibo ${-i}`,
    fn: () => {
      assertEquals(fibo(-i), e);
    },
  });
}

for (const [i, e] of expectNegative.entries()) {
  Deno.test({
    name: `fibo ${-i} (1-1 start)`,
    fn: () => {
      assertEquals(fibo(-i - 1, [1, 1]), e);
    },
  });
}
