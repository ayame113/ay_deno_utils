import { testing } from "../std_deps.ts";
const { assertEquals } = testing.asserts;

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
    assertEquals(await a, 0);
    assertEquals(order, [50, 25, 12, 6, 3, 1, 0]);
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
    assertEquals(typeof await a, "object");
    assertEquals(await a, null);
    assertEquals(order, [50, 76, 89, 95, 98, 100]);
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
    assertEquals(a, 0);
    assertEquals(order, [50, 25, 12, 6, 3, 1, 0]);
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
    assertEquals(typeof a, "object");
    assertEquals(a, null);
    assertEquals(order, [50, 76, 89, 95, 98, 100]);
  },
});

Deno.test({
  name: "binSearch async true x10",
  fn: async () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), Promise.resolve(true)),
      digit: 1,
    });
    assertEquals(typeof a.then, "function");
    assertEquals(typeof await a, "number");
    assertEquals(await a, 0);
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 25, 12.5, 6.2, 3.1, 1.5, 0.7, 0.3, 0.1, 0],
    );
  },
});

Deno.test({
  name: "binSearch async false x10",
  fn: async () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), Promise.resolve(false)),
      digit: 1,
    });
    assertEquals(typeof a.then, "function");
    assertEquals(typeof await a, "object");
    assertEquals(await a, null);
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 75.1, 87.6, 93.9, 97, 98.6, 99.4, 99.8, 100],
    );
  },
});

Deno.test({
  name: "binSearch sync true x10",
  fn: () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), true),
      digit: 1,
    });
    assertEquals(typeof a, "number");
    assertEquals(a, 0);
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 25, 12.5, 6.2, 3.1, 1.5, 0.7, 0.3, 0.1, 0],
    );
  },
});

Deno.test({
  name: "binSearch sync false x10",
  fn: () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), false),
      digit: 1,
    });
    assertEquals(typeof a, "object");
    assertEquals(a, null);
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 75.1, 87.6, 93.9, 97, 98.6, 99.4, 99.8, 100],
    );
  },
});

//端っこの数値だけ通す場合
Deno.test({
  name: "binSearch async 100<=n x10",
  fn: async () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), Promise.resolve(100 <= n)),
      digit: 1,
    });
    assertEquals(typeof a.then, "function");
    assertEquals(typeof await a, "number");
    assertEquals(await a, 100);
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 75.1, 87.6, 93.9, 97, 98.6, 99.4, 99.8, 100, 99.9],
    );
  },
});

Deno.test({
  name: "binSearch sync 100<=n x10",
  fn: () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), 100 <= n),
      digit: 1,
    });
    assertEquals(typeof a, "number");
    assertEquals(a, 100);
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 75.1, 87.6, 93.9, 97, 98.6, 99.4, 99.8, 100, 99.9],
    );
  },
});

Deno.test({
  name: "binSearch async 0<n x10",
  fn: async () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), Promise.resolve(0 < n)),
      digit: 1,
    });
    assertEquals(typeof a.then, "function");
    assertEquals(typeof await a, "number");
    assertEquals(await a, 0.1);
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 25, 12.5, 6.2, 3.1, 1.5, 0.7, 0.3, 0.1, 0],
    );
  },
});

Deno.test({
  name: "binSearch sync 0<n x10",
  fn: () => {
    const order: number[] = [];
    const a = binSearch({
      range: [0, 100],
      isOk: (n) => (order.push(n), 0 < n),
      digit: 1,
    });
    assertEquals(typeof a, "number");
    assertEquals(a, 0.1);
    assertEquals(
      order.map((n) => Math.round(n * 1000000) / 1000000),
      [50, 25, 12.5, 6.2, 3.1, 1.5, 0.7, 0.3, 0.1, 0],
    );
  },
});
