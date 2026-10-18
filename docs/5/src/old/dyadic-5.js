class Dyadic {
  #precision;

  static step(precision) {
    return 2 ** (-precision);
  }

  static range(precision) {
    const maxSafe = Number.MAX_SAFE_INTEGER;
    const factor = 2 ** precision;
    return { min: -maxSafe / factor, max: maxSafe / factor };
  }

  static is(v, precision) {
    if (!Number.isFinite(v)) return false;
    const { min, max } = Dyadic.range(precision);
    if (v < min || v > max) return false;
    return Number.isInteger(v * (2 ** precision));
  }

  static #roundBase(v, precision, computeFn) {
    if (!Number.isFinite(v)) throw new TypeError("Value must be a finite number.");
    const { min, max } = Dyadic.range(precision);
    if (v < min || v > max) {
      throw new RangeError(`Value ${v} is out of the safe range for precision=${precision}.`);
    }
    const factor = 2 ** precision;
    return computeFn(v * factor) / factor;
  }

  // スタティック側の丸め戦略定義 ＆ 自動生成
  static {
    const strategies = {
      ...Object.fromEntries('floor ceil trunc round'.split(' ').map(name => [name, Math[name]])),
      even: (scaled) => {
        const f = Math.floor(scaled);
        const rem = scaled - f;
        if (rem > 0.5) return f + 1;
        if (rem < 0.5) return f;
        return (f % 2 === 0) ? f : f + 1;
      }
    };

    for (const [name, strategy] of Object.entries(strategies)) {
      this[name] = (v, precision) => Dyadic.#roundBase(v, precision, strategy);
    }
  }

  constructor(precision) {
    if (!Number.isInteger(precision) || precision < 0) {
      throw new RangeError("Precision must be a non-negative integer.");
    }
    this.#precision = precision;

    // コンストラクタ内でインスタンスメソッドを動的生成することで、
    #precision に直接アクセスしつつ、重複記述を完全に排除
    for (const name of Object.keys(Dyadic)) {
      // 内部の静的メソッド（step, range, is など）を除外して丸めAPIだけを生やす
      if (typeof Dyadic[name] === 'function' && name !== 'is') {
        this[name] = (v) => Dyadic[name](v, this.#precision);
      }
    }

    // is もインスタンス版として生やす
    this.is = (v) => Dyadic.is(v, this.#precision);
  }

  get precision() { return this.#precision; }
  get step() { return Dyadic.step(this.#precision); }
  get range() { return Dyadic.range(this.#precision); }
}
