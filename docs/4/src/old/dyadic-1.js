class Dyadic {
  // プライベートフィールドで外側からの直接変更を完全にブロック
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

  // --- インスタンスメソッド (内部で #precision を使用) ---
  is(v) {
    return Dyadic.is(v, this.#precision);
  }

  floor(v) {
    return Dyadic.floor(v, this.#precision);
  }

  ceil(v) {
    return Dyadic.ceil(v, this.#precision);
  }

  trunc(v) {
    return Dyadic.trunc(v, this.#precision);
  }

  round(v) {
    return Dyadic.round(v, this.#precision);
  }

  even(v) {
    return Dyadic.even(v, this.#precision);
  }

  // ==========================================
  // --- スタティックメソッド (従来どおり単体でも呼べる) ---
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

  static _validateRange(v, precision) {
    if (!Number.isFinite(v)) {
      throw new TypeError("Value must be a finite number.");
    }
    const { min, max } = Dyadic.range(precision);
    if (v < min || v > max) {
      throw new RangeError(`Value ${v} is out of the safe range [${min}, ${max}] for precision=${precision}.`);
    }
  }

  static is(v, precision) {
    if (!Number.isFinite(v)) return false;
    const { min, max } = Dyadic.range(precision);
    if (v < min || v > max) return false;

    const scaled = v * (2 ** precision);
    return Number.isInteger(scaled);
  }

  static floor(v, precision) {
    Dyadic._validateRange(v, precision);
    const factor = 2 ** precision;
    return Math.floor(v * factor) / factor;
  }

  static ceil(v, precision) {
    Dyadic._validateRange(v, precision);
    const factor = 2 ** precision;
    return Math.ceil(v * factor) / factor;
  }

  static trunc(v, precision) {
    Dyadic._validateRange(v, precision);
    const factor = 2 ** precision;
    return Math.trunc(v * factor) / factor;
  }

  static round(v, precision) {
    Dyadic._validateRange(v, precision);
    const factor = 2 ** precision;
    return Math.round(v * factor) / factor;
  }

  static even(v, precision) {
    Dyadic._validateRange(v, precision);
    const factor = 2 ** precision;
    const scaled = v * factor;
    
    const f = Math.floor(scaled);
    const rem = scaled - f;
    
    let roundedScaled;
    if (rem > 0.5) {
      roundedScaled = f + 1;
    } else if (rem < 0.5) {
      roundedScaled = f;
    } else {
      roundedScaled = (f % 2 === 0) ? f : f + 1;
    }
    
    return roundedScaled / factor;
  }
}
