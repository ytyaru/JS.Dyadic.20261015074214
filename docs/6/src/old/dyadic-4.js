class Dyadic {
  #precision;

  constructor(precision) {
    if (!Number.isInteger(precision) || precision < 0) {
      throw new RangeError("Precision must be a non-negative integer.");
    }
    this.#precision = precision;
  }

  get precision() { return this.#precision; }
  get step() { return Dyadic.step(this.#precision); }
  get range() { return Dyadic.range(this.#precision); }

  is(v) { return Dyadic.is(v, this.#precision); }
  floor(v) { return Dyadic.floor(v, this.#precision); }
  ceil(v) { return Dyadic.ceil(v, this.#precision); }
  trunc(v) { return Dyadic.trunc(v, this.#precision); }
  round(v) { return Dyadic.round(v, this.#precision); }
  even(v) { return Dyadic.even(v, this.#precision); }

  static step(precision) { return 2 ** (-precision); }

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

  // 完全にクラス内部に隠蔽されたプライベート静的メソッド
  static #roundBase(v, precision, computeFn) {
    if (!Number.isFinite(v)) throw new TypeError("Value must be a finite number.");
    const { min, max } = Dyadic.range(precision);
    if (v < min || v > max) {
      throw new RangeError(`Value ${v} is out of the safe range for precision=${precision}.`);
    }
    const factor = 2 ** precision;
    return computeFn(v * factor) / factor;
  }

  // ==========================================
  // 静的初期化ブロック: 単一のループで完全DRYにメソッドを生成
  // ==========================================
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

    // ラップ処理はここで『1回だけ』定義し、すべてのメソッドに適用する
    for (const [name, strategy] of Object.entries(strategies)) {
      this[name] = (v, precision) => Dyadic.#roundBase(v, precision, strategy);
    }
  }
}
