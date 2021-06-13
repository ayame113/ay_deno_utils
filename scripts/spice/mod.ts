// @ts-check

import { readLines } from "https://deno.land/std@0.97.0/io/mod.ts";
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
  await res.spiceData;
  return res;
}

export class SpiceRunner<T extends readonly string[]> {
  spiceData: Promise<spiceData<T>[]>;
  constructor(
    args: SpiceRunnerConstructorArg<T>,
  ) {
    this.spiceData = this.#getSpiceData(args);
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
          !line.trim().startsWith("clk")
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
  async vtime(t: number) {
    const data = await this.spiceData;
    const i = await this.#getIndexAt(t);
    if (data[i].t === t) {
      //data[i]をそのまま返す
      return data[i];
    }
    //data[i]とdata[i-1]の平均を返す
    return Object.fromEntries(
      Object.keys(data).map((
        k: T[number],
      ) => [k, (data[i][k] + data[i - 1][k]) / 2]),
    ) as spiceData<T>;
  }
  /**
	 * {netName}が{v}より立ち上がる/立ち下がる時刻を調べる。
	 * {from}から{to}の範囲で調べる。
	 */
  async riseOrFallThan({
    v,
    netName,
    range: [from, to],
  }: {
    v: number;
    netName: T[number];
    range: [number, number];
  }) {
    const data = await this.spiceData;
    const res = [];
    const fromI = await this.#getIndexAt(from);
    const toI = await this.#getIndexAt(to);
    const isFirst = Symbol("isFirst");
    let prev: symbol | spiceData<T> = isFirst;
    for (const i of range(fromI, toI)) {
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
  async #getIndexAt(t: number) {
    const data = await this.spiceData;
    return binSearch({
      range: [0, data.length],
      isOk: (i) => t <= data[i].t,
    });
  }
}
