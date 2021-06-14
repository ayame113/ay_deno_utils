/// <reference types="./mod.d.ts" />

//jsDocでオーバーロードできない
//https://github.com/microsoft/TypeScript/issues/25590

export function binSearch({
  range: [from, to],
  isOk,
  digit = 0,
}) {
  let left = from * (10 ** digit) - 1;
  let right = to * (10 ** digit) + 1;
  const mid = Math.ceil(left + (right - left) / 2);
  if (typeof isOk !== "function") {
    throw new Error("isOk is not callable");
  }
  const firstRes = isOk(mid * (10 ** -digit));
  if (
    firstRes !== true && firstRes !== false &&
    typeof firstRes.then === "function"
  ) {
    // 非同期実行
    return (async () => {
      if (await firstRes) {
        right = mid;
      } else {
        left = mid;
      }
      while (1 < right - left) {
        const mid = Math.ceil(left + (right - left) / 2);
        if (await isOk(mid * (10 ** -digit))) {
          right = mid;
        } else {
          left = mid;
        }
      }
      if (right <= to * (10 ** digit)) {
        return right * (10 ** -digit);
      }
      return null;
    })();
  } else {
    // 同期実行
    if (firstRes) {
      right = mid;
    } else {
      left = mid;
    }
    while (1 < right - left) {
      const mid = Math.ceil(left + (right - left) / 2);
      if (isOk(mid * (10 ** -digit))) {
        right = mid;
      } else {
        left = mid;
      }
    }
    if (right <= to * (10 ** digit)) {
      return right * (10 ** -digit);
    }
    return null;
  }
}
