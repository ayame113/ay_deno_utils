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
  /** @type {FunctionTip[]}*/
  #applyFunctions = [];
  constructor(/**@type {Number[]}*/ ...args) {
    if (args.length === 1) {
      this.#to = args[0];
    } else if (args.length === 2) {
      this.#from = args[0];
      this.#to = args[1];
    } else {
      this.#from = args[0];
      this.#to = args[1];
      this.#step = args[2];
    }
  }
  /**
	 * @template Tf
	 * @param  {function(...any): Tf} fn
	 * @return {Iter<Tf>}
	 */
  map(fn) {
    const res = new /**@type {typeof Iter}*/ (this.constructor)(
      this.#from,
      this.#to,
      this.#step,
    );
    res.#applyFunctions = [...this.#applyFunctions, {
      type: "map",
      fn,
    }];
    return res;
  }
  forEach(/** @type {Function}*/ fn) {
    const res = new /**@type {typeof Iter}*/ (this.constructor)(
      this.#from,
      this.#to,
      this.#step,
    );
    res.#applyFunctions = [...this.#applyFunctions, {
      type: "forEach",
      fn,
    }];
    return res;
  }
  filter(/** @type {Function}*/ fn) {
    const res = new /**@type {typeof Iter}*/ (this.constructor)(
      this.#from,
      this.#to,
      this.#step,
    );
    res.#applyFunctions = [...this.#applyFunctions, {
      type: "filter",
      fn,
    }];
    return res;
  }
  /** @return {Array<T>} */
  excute() {
    return [...this];
  }
  [Symbol.iterator]() {
    return /** @type {ReangeIterator<T>} */ (new ReangeIterator(
      this.#from,
      this.#to,
      this.#step,
      this.#applyFunctions,
    ));
  }
}

/** @template T */
class ReangeIterator {
  /**@type {Number}*/ #from;
  /**@type {Number}*/ #to;
  /**@type {Number}*/ #step;
  /**@type {FunctionTip[]}*/ #applyFunctions;
  /**@type {Number}*/ #i;
  /**
	 * @param {Number} from
	 * @param {Number} to
	 * @param {Number} step
	 * @param {FunctionTip[]} applyFunctions
	 */
  constructor(from, to, step, applyFunctions) {
    this.#from = from;
    this.#to = to;
    this.#step = step;
    this.#applyFunctions = applyFunctions;
    this.#i = from;
  }
  /** @return {IteratorNextResult<T>} */
  next() {
    const done = (this.#i < this.#to) !== (this.#from < this.#to);
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
  return /**@type {Iter<Number>}*/ (new Iter(...args));
}
