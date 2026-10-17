class Dyadic {
  #precision;

  constructor(precision) {
    if (!Number.isInteger(precision) || precision < 0) {
      throw new RangeError("Precision must be a non-negative integer.");
    }
    this.#precision = precision;
  }

  // --- ゲッター ---
  get precision() { return this.#precision; }
  get step() { return Dyadic.step(this.#precision); }
  get range() { return Dyadic.range(this.#precision); }

  // --- インスタンスメソッド ---
  is(v) { return Dyadic.is(v, this.#precision); }
  floor(v) { return Dyadic.floor(v, this.#precision); }
  ceil(v) { return Dyadic.ceil(v, this.#precision); }
  trunc(v) { return Dyadic.trunc(v, this.#precision); }
  round(v) { return Dyadic.round(v, this.#precision); }
  even(v) { return Dyadic.even(v, this.#precision); }

  // --- スタティックメソッド ---
  static step(precision) {
    return 2 ** (-precision);
  }

  static range(precision) {
    const maxSafe = Number.MAX_SAFE_INTEGER;
    const factor = 2 ** precision;
    return {
      min: -maxSafe / factor,
      max: maxSafe / factor
    };
  }

  static is(v, precision) {
    if (!Number.isFinite(v)) return false;
    const { min, max } = Dyadic.range(precision);
    if (v < min || v > max) return false;

    const scaled = v * (2 ** precision);
    return Number.isInteger(scaled);
  }

  static _roundBase(v, precision, computeFn) {
    if (!Number.isFinite(v)) {
      throw new TypeError("Value must be a finite number.");
    }
    const { min, max } = Dyadic.range(precision);
    if (v < min || v > max) {
      throw new RangeError(`Value ${v} is out of the safe range [${min}, ${max}] for precision=${precision}.`);
    }

    const factor = 2 ** precision;
    const scaled = v * factor;
    return computeFn(scaled) / factor;
  }

  // 丸めアルゴリズムの定義マップ
  static #strategies = {
    floor: (scaled) => Math.floor(scaled),
    ceil:  (scaled) => Math.ceil(scaled),
    trunc: (scaled) => Math.trunc(scaled),
    round: (scaled) => Math.round(scaled),
    even:  (scaled) => {
      const f = Math.floor(scaled);
      const rem = scaled - f;
      if (rem > 0.5) return f + 1;
      if (rem < 0.5) return f;
      return (f % 2 === 0) ? f : f + 1;
    }
  };

  // マップを元にスタティックメソッドを動的に自動生成する
  // (※静的初期化ブロック static {} を使ってクラス定義内で完結させます)
  // または、外側で代入するかこのブロックを使用します
}

// クラス定義外（または静的初期化ブロック内）でAPIを生やす処理
for (const [name, strategy] of Object.entries(Dyadic._strategies ?? /* 内部マップ */ {})) {
  // ※ #strategies は外部から直接見えないため、以下のように安全に紐付ける
}
