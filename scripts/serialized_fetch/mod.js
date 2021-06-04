const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const isFirst = Symbol("isFirst");
class SerializeFetcher {
  constructor({ delay } = {}) {
    /**前回のリクエストが終了した時刻で解決するPromise*/
    this.promise = Promise.resolve(isFirst);
    this.delay = delay; //ミリ秒
  }
  fetch(...args) {
    const fetchPromise = this.promise.then((lastRequestEnd) => {
      if (!this.delay) {
        return;
      }
      if (lastRequestEnd === isFirst) {
        return;
      }
      const elapsedTime = Date.now() - lastRequestEnd;
      if (this.delay < elapsedTime) {
        return;
      }
      return delay(this.delay - elapsedTime);
    }).then(() => fetch(...args));
    this.promise = fetchPromise.catch().then(() => Date.now());
    return fetchPromise;
  }
}

export function createSerializeFetch(...args) {
  const fetcher = new SerializeFetcher(...args);
  return function fetch(...args) {
    return fetcher.fetch(...args);
  };
}
/*
const start = performance.now();
const _fetch = createSerializeFetch({ delay: 3000 });
for (let i = 0; i < 10; i++) {
  _fetch("https://www.yahoo.co.jp");
  console.log(i);
}
await _fetch("https://www.yahoo.co.jp");
console.log(performance.now() - start);
*/
