import { assertEquals } from "https://deno.land/std@0.98.0/testing/asserts.ts";

import { binSearch } from "./mod.js";

Deno.test({
  name: "binSearch async true",
  fn: async () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), Promise.resolve(true)),
    });
    assertEquals(typeof a.then, "function");
    assertEquals(typeof await a, "number");
    assertEquals(order, [50, 25, 13, 7, 4, 2, 1]);
    assertEquals(await a, 1);
  },
});

Deno.test({
  name: "binSearch async false",
  fn: async () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), Promise.resolve(false)),
    });
    assertEquals(typeof a.then, "function");
    assertEquals(typeof await a, "number");
    assertEquals(order, [50, 75, 88, 94, 97, 99]);
    assertEquals(await a, 100);
  },
});

Deno.test({
  name: "binSearch sync true",
  fn: () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), true),
    });
    assertEquals(typeof a, "number");
    assertEquals(order, [50, 25, 13, 7, 4, 2, 1]);
    assertEquals(a, 1);
  },
});

Deno.test({
  name: "binSearch sync false",
  fn: () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), false),
    });
    assertEquals(typeof a, "number");
    assertEquals(order, [50, 75, 88, 94, 97, 99]);
    assertEquals(a, 100);
  },
});

Deno.test({
  name: "binSearch async true",
  fn: async () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), Promise.resolve(true)),
      digit: 1,
    });
    assertEquals(typeof a.then, "function");
    assertEquals(typeof await a, "number");
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 25, 12.5, 6.3, 3.2, 1.6, 0.8, 0.4, 0.2, 0.1],
    );
    assertEquals(await a, 0.1);
  },
});

Deno.test({
  name: "binSearch async false",
  fn: async () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), Promise.resolve(false)),
      digit: 1,
    });
    assertEquals(typeof a.then, "function");
    assertEquals(typeof await a, "number");
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 75, 87.5, 93.8, 96.9, 98.5, 99.3, 99.7, 99.9],
    );
    assertEquals(await a, 100);
  },
});

Deno.test({
  name: "binSearch sync true",
  fn: () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), true),
      digit: 1,
    });
    assertEquals(typeof a, "number");
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 25, 12.5, 6.3, 3.2, 1.6, 0.8, 0.4, 0.2, 0.1],
    );
    assertEquals(a, 0.1);
  },
});

Deno.test({
  name: "binSearch sync false",
  fn: () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), false),
      digit: 1,
    });
    assertEquals(typeof a, "number");
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 75, 87.5, 93.8, 96.9, 98.5, 99.3, 99.7, 99.9],
    );
    assertEquals(a, 100);
  },
});
