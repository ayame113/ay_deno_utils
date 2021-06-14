import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.98.0/testing/asserts.ts";

import { runSpice } from "./mod.ts";

Deno.test({
  name: "spice run #1",
  fn: async () => {
    const result = await runSpice({
      netNameList: ["CLK", "D", "Q"] as const,
      pathToResultFile: new URL("./test1.txt", import.meta.url),
      isDebug: true,
    });
    assertEquals(await result.vtime(4E-9), { t: 4e-9, CLK: 0, D: 0, Q: 1.772 });
    assertEquals(
      await result.riseOrFallThan({
        v: 0.9,
        netName: "CLK",
        range: [0, 10E-9],
      }),
      [
        {
          CLK: 1.8,
          D: 0,
          Q: 0.1548,
          t: 1e-9,
        },
        {
          CLK: 0,
          D: 0,
          Q: -0.09605,
          t: 1.99e-9,
        },
        {
          CLK: 1.8,
          D: 1.8,
          Q: 0.1594,
          t: 3e-9,
        },
        {
          CLK: 0,
          D: 0,
          Q: 1.721,
          t: 3.99e-9,
        },
        {
          CLK: 1.8,
          D: 0,
          Q: 1.908,
          t: 5e-9,
        },
        {
          CLK: 0,
          D: 1.8,
          Q: -0.09703,
          t: 5.99e-9,
        },
        {
          CLK: 1.8,
          D: 1.8,
          Q: 0.1635,
          t: 7e-9,
        },
        {
          CLK: 0,
          D: 1.8,
          Q: 1.721,
          t: 7.99e-9,
        },
        {
          CLK: 1.8,
          D: 1.8,
          Q: 1.915,
          t: 9e-9,
        },
        {
          CLK: 3.196e-10,
          D: 1.8,
          Q: 1.721,
          t: 9.99e-9,
        },
      ],
    );
  },
});

Deno.test({
  name: "spice run #2",
  fn: async () => {
    const result = await runSpice({
      netNameList: ["Y"] as const,
      pathToResultFile: new URL("./test2.txt", import.meta.url),
      isDebug: true,
    });
    assertEquals(await result.vtime(0.5), { t: 0.5, Y: 0.5 });
    assertEquals(
      await result.riseOrFallThan({
        v: 0.5,
        netName: "Y",
        range: [0, 1],
      }),
      [{ t: 1, Y: 1 }],
    );
  },
});

Deno.test({
  name: "spice run #3",
  fn: async () => {
    await assertThrowsAsync(
      async () => {
        await runSpice({
          netNameList: ["Y"] as const,
          pathToResultFile: new URL("./test3.txt", import.meta.url),
          isDebug: true,
        });
      },
      Error,
      "parse error: NaN",
    );
  },
});
