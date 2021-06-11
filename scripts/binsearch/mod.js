//@ts-check
/**
 * @typedef {object} binSearchOptions
 * @property {[Number, Number]} range
 * @property {(n: Number)=>Promise<boolean>|boolean} isOk nが条件を満たすかどうか
 * @property {Number} [digit] 調べる桁数。1を指定した場合は小数第1位まで調べる。デフォルト0。
 */

/**
  * @typedef {object} binSearchSyncOptions
  * @property {[Number, Number]} range
  * @property {(n: Number)=>boolean} isOk nが条件を満たすかどうか
  * @property {Number} [digit] 調べる桁数。1を指定した場合は小数第1位まで調べる。デフォルト0。
  */

/**
  * めぐる式二分探索 https://qiita.com/drken/items/97e37dd6143e33a64c8c
  * 区間の始点はfalse、終点はtrueと仮定し、isOk(n)がtrueになる最小の数を見つける
  * @return {Promise<Number>} isOkを満たす最小の数
  */
export async function binSearch(/**@type {binSearchOptions}*/ {
  range: [from, to],
  isOk,
  digit = 0,
}) {
  let left = from * (10 ** digit) - 1;
  let right = to * (10 ** digit);
  while (1 < right - left) {
    const mid = Math.ceil(left + (right - left) / 2);
    if (await isOk(mid * (10 ** -digit))) {
      right = mid;
    } else {
      left = mid;
    }
  }
  return right * (10 ** -digit);
}
/**
  * めぐる式二分探索 https://qiita.com/drken/items/97e37dd6143e33a64c8c
  * 区間の始点はfalse、終点はtrueと仮定し、isOk(n)がtrueになる最小の数を見つける
  * @return {Number} isOkを満たす最小の数
  */
export function binSearchSync(/**@type {binSearchSyncOptions}*/ {
  range: [from, to],
  isOk,
  digit = 0,
}) {
  let left = from * (10 ** digit) - 1;
  let right = to * (10 ** digit);
  while (1 < right - left) {
    const mid = Math.ceil(left + (right - left) / 2);
    if (isOk(mid * (10 ** -digit))) {
      right = mid;
    } else {
      left = mid;
    }
  }
  return right * (10 ** -digit);
}
/*
console.log(binSearch({
  range: [0, 100],
  isOk: (i) => 50 < i,
}));
console.log(binSearch({
  range: [0, 100],
  isOk: () => true,
}));

console.log(binSearch({
  range: [-100, 100],
  isOk: (i) => 20 < i,
  digit: 1,
}));
console.log(binSearchSync({
range: [0, 100],
isOk: (i) => (console.log("i", i), 100 < i),
}));
*/
