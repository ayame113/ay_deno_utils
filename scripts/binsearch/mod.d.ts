/**
 * めぐる式二分探索 https://qiita.com/drken/items/97e37dd6143e33a64c8c
 * 区間の始点はfalse、終点はtrueと仮定し、isOk(n)がtrueになるような最小の数を見つける。
 * isOkが最初にPromiseを返す場合は{Promise<number>}を、それ以外の場合は{number}を返す。
 * @param {[number, number]} arg.range 二分探索する範囲([from, to])
 * @param {(n: number) => Promise<boolean>|boolean} arg.isOk 判定に使用する関数
 * @param {number} arg.digit 二分探索する桁数
 */
export function binSearch(arg: {
  range: [number, number];
  isOk: (n: number) => Promise<boolean>;
  digit?: number;
}): Promise<number>;

export function binSearch(arg: {
  range: [number, number];
  isOk: (n: number) => boolean;
  digit?: number;
}): number;
