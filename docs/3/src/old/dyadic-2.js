class Dyadic {
  #precision;

  /**
   * @param {number} precision - 2のマイナスN乗の N (例: 1 なら 0.5刻み)
   */
  constructor(precision) {
    if (!Number.isInteger(precision) || precision < 0) {
      throw new RangeError("Precision must be a non-negative integer.");
    }
    this.#precision = precision;
  }

  // --- ゲッター ---
  get precision() {
    return this.#precision;
  }

  get step() {
    return Dyadic.step(this.#precision);
  }

  get range() {
    return Dyadic.range(this.#precision);
  }

  // --- インスタンスメソッド (インスタンスの #precision を利用) ---
  is(v) { return Dyadic.is(v, this.#precision); }
  floor(v) { return Dyadic.floor(v, this.#precision); }
  ceil(v) { return Dyadic.ceil(v, this.#precision); }
  trunc(v) { return Dyadic.trunc(v, this.#precision); }
  round(v) { return Dyadic.round(v, this.#precision); }
  even(v) { return Dyadic.even(v, this.#precision); }


  // ==========================================
  // --- スタティックメソッド (すべての本質がここにある) ---
  // ==========================================

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

  /**
   * 【DRY化のキモ】
   * すべての丸め処理に共通する「検証 ➔ 拡大 ➔ 計算 ➔ 縮小」のテンプレートメソッド
   * @param {number} v 
   * @param {number} precision 
   * @param {(scaled: number) => number} computeFn - 拡大された値に対する丸め計算ロジック
   */
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
    const computedScaled = computeFn(scaled);
    return computedScaled / factor;
  }

  // 各種丸めは _roundBase を呼ぶだけで、重複コードが完全に消滅する

  static floor(v, precision) {
    return Dyadic._roundBase(v, precision, (scaled) => Math.floor(scaled));
  }

  static ceil(v, precision) {
    return Dyadic._roundBase(v, precision, (scaled) => Math.ceil(scaled));
  }

  static trunc(v, precision) {
    return Dyadic._roundBase(v, precision, (scaled) => Math.trunc(scaled));
  }

  static round(v, precision) {
    return Dyadic._roundBase(v, precision, (scaled) => Math.round(scaled));
  }

  static even(v, precision) {
    return Dyadic._roundBase(v, precision, (scaled) => {
      const f = Math.floor(scaled);
      const rem = scaled - f;
      
      if (rem > 0.5) return f + 1;
      if (rem < 0.5) return f;
      return (f % 2 === 0) ? f : f + 1;
    });
  }
}
