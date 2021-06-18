// @ts-check
import { range } from "../range/mod.js";

/**
 * フィボナッチ数を求める
 * @param  {Number} n
 * @param  {[Number, Number]} [first-second] 初項, 第二項
 * @return {Number}
 */
export function fibo(n, [first, second] = [0, 1]) {
  let a = first;
  let b = second;
  if (0 <= n) {
    for (const _ of range(n)) {
      [a, b] = [b, a + b];
    }
    return a;
  }
  // 負の数に拡張
  for (const _ of range(n)) {
    [a, b] = [b - a, a];
  }
  return b;
}
