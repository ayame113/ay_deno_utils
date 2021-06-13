# runSpice()

hspiceコマンドを実行して結果を解析します。

# 使用方法

```ts
import { runSpice } from "https://raw.githubusercontent.com/ayame113/ay_deno_utils/v1.0.4/scripts/spice/mod.ts";

const spfileText = `
(中略)
.print V(CLK) V(D) V(Q)
.END
`;

// spiceを実行
const result = await runSpice({
  // spiceコマンドで出力される数値
  netNameList: ["CLK", "D", "Q"] as const,
  // spiceファイルの内容
  spfileText,
  // spiceファイルが一時的に書き込まれるファイル
  pathToSpiceFile: "./circuit_tmp.sp",
});

// 指定した時刻における値を取得する
console.log(await result.vtime(4E-9)); //=> { t: 4e-9, CLK: 0, D: 0, Q: 1.772 }

// 立ち上がり/立ち下がり時刻を取得する
console.log(
  await result.riseOrFallThan({
    v: 0.9,
    netName: "CLK",
    range: [0, 10E-9], //調べる範囲
  }),
); //=>0秒から10n秒の間で、CLKが0.9 Vより立ち上がる/立ち下がる時刻を配列で返す
```
