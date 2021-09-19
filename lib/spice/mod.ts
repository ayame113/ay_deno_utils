// @ts-check

import { io } from "../std_deps.ts";
const { readLines } = io;

import { range } from "../range/mod.js";
import { binSearch } from "../binsearch/mod.js";

type spiceData<K extends readonly string[]> = Record<K[number] | "t", number>;

type SpiceRunnerConstructorArg<T> = {
  netNameList: T;
  spfileText: string;
  pathToSpiceFile: string | URL;
  pathToResultFile?: undefined;
  isDebug?: false;
} | {
  netNameList: T;
  spfileText?: undefined;
  pathToSpiceFile?: undefined;
  pathToResultFile: string | URL;
  isDebug: true;
};

/**spiceを実行し、実行結果が入ったSpiceRunnerクラスを返す*/
export async function runSpice<T extends readonly string[]>(
  arg: SpiceRunnerConstructorArg<T>,
) {
  const res = new SpiceRunner(arg);
  await res.spiceDataPromise;
  return res;
}

export type { SpiceRunner };

class SpiceRunner<T extends readonly string[]> {
  spiceDataPromise: Promise<spiceData<T>[]>;
  spiceData: spiceData<T>[] | null;
  constructor(
    args: SpiceRunnerConstructorArg<T>,
  ) {
    this.spiceData = null;
    this.spiceDataPromise = (async () => {
      //こうしないとエラーが外に伝播してキャッチできない
      this.spiceData = await this.#getSpiceData(args);
      return this.spiceData;
    })();
  }
  async #getSpiceData(
    {
      netNameList,
      spfileText = "",
      pathToSpiceFile = "",
      pathToResultFile = "",
      isDebug = false,
    }: SpiceRunnerConstructorArg<T>,
  ) {
    if (!isDebug) {
      await Deno.writeTextFile(pathToSpiceFile, spfileText);
    }
    const { reader, closer } = await this.#run(
      pathToSpiceFile,
      pathToResultFile,
      isDebug,
    );
    try {
      let shouldReadLine = false;
      const spiceData: spiceData<T>[] = [];
      for await (const line of readLines(reader)) {
        if (line == "y") {
          shouldReadLine = false;
        }
        if (
          shouldReadLine && line && !line.trim().startsWith("time") &&
          /[0-9]/.test(line)
        ) {
          const resultList = line.trim().split(/\s+/).map(Number).map((v) => {
            if (isNaN(v)) {
              console.error(line);
              throw new Error("parse error: NaN");
            }
            return v;
          });
          spiceData.push(
            (["t", ...netNameList] as const).reduce(
              (res, n, i) => (res[n] = resultList[i] as number, res),
              {} as spiceData<T>,
            ),
          );
        }
        if (line == "x") {
          shouldReadLine = true;
        }
      }
      return spiceData;
    } finally {
      closer.close();
    }
  }
  async #run(
    pathToSpiceFile: string | URL,
    pathToResultFile: string | URL,
    isDebug: boolean,
  ): Promise<{ closer: Deno.Closer; reader: Deno.Reader }> {
    if (isDebug) {
      const file = await Deno.open(pathToResultFile);
      return { closer: file, reader: file };
    }
    const process = Deno.run({
      cmd: ["hspice", pathToSpiceFile.toString()],
      stdout: "piped",
    });
    return {
      closer: process,
      reader: process.stdout,
    };
  }
  /**時刻{t}におけるデータを返す。*/
  vtime(t: number) {
    const data = this.spiceData;
    assertNotNull(data);
    const i = this.#getIndexAt(t);
    if (i === null) {
      throw new Error("No data was found at the specified time.");
    }
    if (data[i].t === t) {
      //data[i]をそのまま返す
      return data[i];
    }
    //data[i]とdata[i-1]の平均を返す
    return Object.fromEntries(
      Object.keys(data[i]).map((
        k: keyof spiceData<T>,
      ) => [k, (data[i][k] + data[i - 1][k]) / 2]),
    ) as spiceData<T>;
  }
  /**
   * {netName}が{v}より立ち上がる/立ち下がる時刻を調べる。
   * {from}から{to}の範囲で調べる。
   */
  riseOrFallThan({
    v,
    netName,
    range: [from, to],
  }: {
    v: number;
    netName: T[number];
    range: [number, number];
  }) {
    const data = this.spiceData;
    assertNotNull(data);
    const res = [];
    const fromI = this.#getIndexAt(from);
    const toI = this.#getIndexAt(to);
    if (fromI === null || toI === null) {
      throw new Error("can not find data in range");
    }
    const isFirst = Symbol("isFirst");
    let prev: symbol | spiceData<T> = isFirst;
    for (const i of range(fromI, toI + 1)) {
      if (typeof prev !== "symbol") {
        if ((data[i][netName] < v) !== (prev[netName] < v)) {
          res.push(data[i]);
        }
      }
      prev = data[i];
    }
    return res;
  }
  /**時刻{time}より後で{time}に一番近いindexを返す*/
  #getIndexAt(t: number) {
    const data = this.spiceData;
    assertNotNull(data);
    return binSearch({
      range: [0, data.length],
      isOk: (i) => t <= data[i].t,
    });
  }
}

function assertNotNull<T>(v: T): asserts v is NonNullable<T> {
  if (v === null) {
    throw new Error("value is null");
  }
}
