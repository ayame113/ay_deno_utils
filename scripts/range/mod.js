class Iter {
  #from = 0;
  #to = Number.MAX_SAFE_INTEGER;
  #step = 1;
  mapFunctions = [];
  constructor() {
    //
  }
  from(n) {
    this.#from = n;
    return this;
  }
  to(n) {
    this.#to = n;
    return this;
  }
  step(n) {
    this.#step = n;
    return this;
  }
  map(func) {
    this.mapFunctions.push({
      type: "map",
      func,
    });
    return this;
  }
  forEach(func) {
    this.mapFunctions.push({
      type: "forEach",
      func,
    });
    return this;
  }
  filter(func) {
    this.mapFunctions.push({
      type: "filter",
      func,
    });
    return this;
  }
  excute() {
    const ignore = Symbol("ignore");
    const result = [];
    const step = (0 < this.#to - this.#from) === (0 < this.#step)
      ? this.#step
      : -this.#step;
    console.log(this.#from, this.#to, step);
    for (
      let i = this.#from;
      (i < this.#to) === (0 < this.#to - this.#from);
      i += step
    ) {
      let currentValue = i;
      for (const fn of this.mapFunctions) {
        if (fn.type === "map") {
          currentValue = fn.func(currentValue);
        } else if (fn.type === "forEach") {
          fn.func(currentValue);
        } else if (fn.type == "filter") {
          currentValue = fn.func(currentValue) ? currentValue : ignore;
        }
      }
      if (currentValue !== ignore) {
        result.push(currentValue);
      }
    }
    return result;
  }
}

console.log(
  new Iter().to(5).from(10).step(2).map((v) => v * v).filter((v) => 99 < v)
    .excute(),
);
