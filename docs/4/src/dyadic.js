const valid = {
  precision(p) {
    if (!Number.isInteger(p) || p < 0 || p > 53) { // 53だと整数部が1bitすら保てなくなるが整数部が0でいいならそれでOK
      throw new RangeError("Precision must be a non-negative integer.");
    }
    return p;
  },
  value(v) {
    if (!Number.isFinite(v)) {
      throw new TypeError("Value must be a finite number.");
    }
    return v;
  }
};
const core = {
  step: p => 2 ** (-p),
  range(p) {
    const maxSafe = Number.MAX_SAFE_INTEGER;
    const factor = 2 ** p;
    return { min: -maxSafe / factor, max: maxSafe / factor };
  },
  is(v, p) {
    const { min, max } = core.range(p);
    if (v < min || v > max) return false;
    return Number.isInteger(v * (2 ** p));
  },
  round(v, p, computeFn) {
    const { min, max } = core.range(p);
    if (v < min || v > max) {
      throw new RangeError(`Value ${v} is out of the safe range for precision=${p}.`);
    }
    const factor = 2 ** p;
    return computeFn(v * factor) / factor;
  }
};
const strategies = {
  ...Object.fromEntries('floor ceil trunc round'.split(' ').map(name => [name, Math[name]])),
  even(scaled) {
    const f = Math.floor(scaled);
    const rem = scaled - f;
    if (rem > 0.5) return f + 1;
    if (rem < 0.5) return f;
    return (f % 2 === 0) ? f : f + 1;
  }
};
const validNum = (valid, msg, ...args) => args.every(x=>valid(x) ? true : (()=>{throw new TypeError(m)}))
const validFin = (...args) => validNum(Number.isFinite, '引数はNumber.isFiniteが真を返す数であるべきです。', ...args);
const validInt = (...args) => validNum(Number.isSafeInteger, '引数はNumber.isSafeIntegerが真を返す数であるべきです。', ...args);
//const validFin (...args) => args.every(x=>Number.isFinite(x) ? true : (()=>{throw new TypeError(`引数はNumber型有限数であるべきです。`)}))
//const validInt (...args) => args.every(x=>Number.isFinite(x) ? true : (()=>{throw new TypeError(`引数はNumber型有限数であるべきです。`)}))
//const order = cv => { for (let [c,v] of cv) {if (c) return v;} }
/*
const cond = (...cvs) => {
    if (cvs.length < 2) { throw TypeError(`引数は2つ以上必要です。[cond1, retVal1, cond2, retVal2, ..., (defVal)]`) }
    const N = Math.floor(cvs.length / 2);
    for (let i=0; i<N*2; i+=2) { if (cvs[i]) { return cvs[i+1] } }
    if (N*2 < cvs.length) { return cvs[N*2] }
}
*/
class Range {
    #min; #max;
    constructor(min,max) {
        validFin(min,max);
        if (max<=min) {throw new RangeError(`引数はmin,maxの順で、かつ大小関係があるべきです。`)}
    }
    get min() {return this.#min}
    get max() {return this.#max}
    three(v) {
        validFin(v);
//        return cond(v < this.#min, -1, this.#max < v, 1, 0)
             if (v < this.#min) {return -1}
        else if (this.#max < v) {return  1}
                                 return  0;
    }
    within(v) {return 0===this.three(v)}
    throw(v) {
        const t = this.three(v);
        if (0!==t) {throw new RangeError(`vは${0<t ? 'min' : 'max'}を超過しています。`)}
        return v;
    }
}
class Fraction {
    #n; #d;
    constructor(n,d) {
        validInt(n,d);
    }
    get n() {return this.#n}
    get d() {return this.#d}
    set n(v) {
        if (v <= this.#d)
    }
}
class Dyadic {
    #exponent;
    #denominator;
    #;
    #;
    #;
    #;
|分母|2**(1〜53)
numerator|分子|1〜分母
step|分解能|1/denominator
range|範囲値|min,max


    constructor(exponent) {
        this
    }

}
export class Dyadic {
  #precision;

  constructor(precision) {
    this.#precision = valid.precision(precision);
    for (const [name, strategy] of Object.entries(strategies)) {
      //this[name] = v=>core.round(valid.value(v), this.#precision, strategies[name]);
      this[name] = v=>core.round(valid.value(v), this.#precision, strategy);
    }
  }

  get precision() { return this.#precision; }
  get step()      { return core.step(this.#precision); }
  get range()     { return core.range(this.#precision); }

  is(v)           { return core.is(valid.value(v), this.#precision); }

  // --- スタティック API の自動生成 ---
  static step(p) { return core.step(valid.precision(p)); }
  static range(p) { return core.range(valid.precision(p)); }
  static is(v, p) { return core.is(valid.value(v), valid.precision(p)); }
}

// 静的丸めメソッドの動的バインド（重複の排除）
for (const [name, strategy] of Object.entries(strategies)) {
  Dyadic[name] = (v,p)=>core.round(valid.value(v), valid.precision(p), strategy);
}
