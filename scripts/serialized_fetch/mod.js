const delay = (ms) => new Promise((r) => setTimeout(r, ms));
class SerializeFetcher {
  constructor({ delay }) {
    this.promise = new Promise();
    this.delay = delay;
  }
  fetch(...args) {
    this.promise = this.promise.catch().then(() => delay(this.delay)).then(() =>
      fetch(...args)
    );
    return this.promise;
  }
}

export function createSerializeFetch(...args) {
  const fetcher = new SerializeFetcher(...args);
  return function fetch(...args) {
    fetcher.fetch(...args);
  };
}
