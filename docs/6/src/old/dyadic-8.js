const valid = {
  precision(p) {
    if (!Number.isInteger(p) || p < 0) {
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
//  step(p) {
//    return 2 ** (-p);
//  },
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

export class Dyadic {
  #precision;

  constructor(precision) {
    this.#precision = valid.precision(precision);
    for (const [name, strategy] of Object.entries(strategies)) {
      this[name] = v=>core.round(valid.value(v), this.#precision, strategies[name]);
    }
  }

  get precision() { return this.#precision; }
  get step()      { return core.step(this.#precision); }
  get range()     { return core.range(this.#precision); }

  is(v) {
    return core.is(valid.value(v), this.#precision);
  }

  // --- スタティック API の自動生成 ---
  static step(p) { return core.step(valid.precision(p)); }
  static range(p) { return core.range(valid.precision(p)); }
  static is(v, p) { return core.is(valid.value(v), valid.precision(p)); }
}

// 静的丸めメソッドの動的バインド（重複の排除）
for (const [name, strategy] of Object.entries(strategies)) {
  Dyadic[name] = (v,p)=>core.round(valid.value(v), valid.precision(p), strategy);
//  Dyadic.prototype[name] = v=>core.round(valid.value(v), this.#precision, strategies[name]);
  /*
  Dyadic[name] = function(v, p) {
    return core.round(valid.value(v), valid.precision(p), strategy);
  };
  
  // ついでにインスタンスメソッド側もここで一括生やしてクラス内の記述を消すことも可能
  Dyadic.prototype[name] = function(v) {
    return core.round(valid.value(v), this.#precision, strategies[name]);
  };
  */
}
