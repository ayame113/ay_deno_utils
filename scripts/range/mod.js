// @ts-check

/**
 * @typedef {Object} FunctionTip
 * @property {'map'|'filter'|'forEach'} type
 * @property {Function} fn
 */
/**
 * @template T
 * @typedef {{done: true, value: undefined}|{done: false, value: T}} IteratorNextResult
 */

/**
 * @template T
 */
class Iter {
  #from = 0;
  #to = Number.MAX_SAFE_INTEGER;
  #step = 1;
  /** @type {Iterable<T>|undefined}*/
  #iterable;
  /** @type {FunctionTip[]}*/
  #applyFunctions = [];
  from(/** @type {Number}*/ n) {
    this.#from = n;
    return this;
  }
  to(/** @type {Number}*/ n) {
    this.#to = n;
    return this;
  }
  step(/** @type {Number}*/ n) {
    this.#step = n;
    return this;
  }
  with(/** @type {Iterable<T>|undefined}*/ iterable) {
    this.#iterable = iterable;
  }
  /**
	* @template Tf
	 * @param  {function(...any): Tf} fn
	 * @return {Iter<Tf>}
	 */
  map(fn) {
    this.#applyFunctions.push({
      type: "map",
      fn,
    });
    return /** @type {*} */ (this); //Iter<T> as any as Iter<Tf>
  }
  forEach(/** @type {Function}*/ fn) {
    this.#applyFunctions.push({
      type: "forEach",
      fn,
    });
    return this;
  }
  filter(/** @type {Function}*/ fn) {
    this.#applyFunctions.push({
      type: "filter",
      fn,
    });
    return this;
  }
  /**
	 * @return {Array<T>}
	 */
  excute() {
    return [...this];
  }
  [Symbol.iterator]() {
    return /** @type {ReangeIterator<T>} */ (new ReangeIterator(
      this.#from,
      this.#to,
      this.#step,
      this.#iterable,
      this.#applyFunctions,
    ));
  }
}

/**
   * @template T
 */
class ReangeIterator {
  /**@type {Number}*/ #from;
  /**@type {Number}*/ #to;
  /**@type {Number}*/ #step;
  /**@type {Iterable<any>|undefined}*/ #iterable;
  /**@type {FunctionTip[]}*/ #applyFunctions;
  /**@type {Number}*/ #i;
  /**
	 * @param {Number} from
	 * @param {Number} to
	 * @param {Number} step
	 * @param {Iterable<any>|undefined} iterable
	 * @param {FunctionTip[]} applyFunctions
	 */
  constructor(from, to, step, iterable, applyFunctions) {
    this.#from = from;
    this.#to = to;
    this.#step = step;
    this.#iterable = iterable;
    this.#applyFunctions = applyFunctions;
    this.#i = from;
  }
  /** @return {IteratorNextResult<T>} */
  next() {
    const done = (this.#i < this.#to) === (this.#from < this.#to);
    if (done) {
      return {
        done,
        value: void 0,
      };
    }
    let isIgnored = false;
    /**@type {any}*/
    let value = this.#i;
    for (const fn of this.#applyFunctions) {
      if (fn.type === "map") {
        value = fn.fn(value);
      } else if (fn.type === "forEach") {
        fn.fn(value);
      } else if (fn.type == "filter") {
        if (!fn.fn(value)) {
          isIgnored = true;
          break;
        }
      }
    }
    this.#i += (this.#from < this.#to) === (0 < this.#step)
      ? this.#step
      : -this.#step;
    if (!isIgnored) {
      return {
        done,
        value,
      };
    } else {
      return this.next();
    }
  }
}

export function range(/**@type {Number[]}*/ ...args) {
  /**@type {Iter<Number>}*/
  const res = new Iter();
  if (args.length === 1) {
    res.to(args[0]);
  } else if (args.length === 2) {
    res.from(args[0]).to(args[1]);
  } else {
    res.from(args[0]).to(args[1]).step(args[3]);
  }
  return res;
}

if ("Deno" in globalThis) {
  Deno.test({
    name: "range1",
    fn: async () => {
      const {
        assertEquals,
      } = await import("https://deno.land/std@0.97.0/testing/asserts.ts");
      assertEquals(new Iter().to(5).excute(), [0, 1, 2, 3, 4]);
    },
  });
  Deno.test({
    name: "range2",
    fn: async () => {
      const {
        assertEquals,
      } = await import("https://deno.land/std@0.97.0/testing/asserts.ts");
      assertEquals([...new Iter().to(5)], [0, 1, 2, 3, 4]);
    },
  });
}
