class Dyadic {
  /**
   * @param {number} n - 2のマイナスN乗の N (例: 1 なら 0.5刻み)
   */
  constructor(n) {
    if (!Number.isInteger(n) || n < 0) {
      throw new RangeError("N must be a non-negative integer.");
    }
    this.n = n;
  }

  // --- ゲッター ---
  get step() {
    return Dyadic.step(this.n);
  }

  get range() {
    return Dyadic.range(this.n);
  }

  // --- インスタンスメソッド ---
  is(v) {
    return Dyadic.is(v, this.n);
  }

  floor(v) {
    return Dyadic.floor(v, this.n);
  }

  ceil(v) {
    return Dyadic.ceil(v, this.n);
  }

  trunc(v) {
    return Dyadic.trunc(v, this.n);
  }

  round(v) {
    return Dyadic.round(v, this.n);
  }

  even(v) {
    return Dyadic.even(v, this.n);
  }

  // ==========================================
  // --- スタティックメソッド（直接関数として呼べる） ---
  // ==========================================

  static step(n) {
    return 2 ** (-n);
  }

  static range(n) {
    const maxSafe = Number.MAX_SAFE_INTEGER;
    const factor = 2 ** n;
    return {
      min: -maxSafe / factor,
      max: maxSafe / factor
    };
  }

  /**
   * 範囲チェックのヘルパー（範囲外なら RangeError をスロー）
   */
  static _validateRange(v, n) {
    if (!Number.isFinite(v)) {
      throw new TypeError("Value must be a finite number.");
    }
    const { min, max } = Dyadic.range(n);
    if (v < min || v > max) {
      throw new RangeError(`Value ${v} is out of the safe range [${min}, ${max}] for N=${n}.`);
    }
  }

  static is(v, n) {
    if (!Number.isFinite(v)) return false;
    const { min, max } = Dyadic.range(n);
    if (v < min || v > max) return false;

    const scaled = v * (2 ** n);
    return Number.isInteger(scaled);
  }

  static floor(v, n) {
    Dyadic._validateRange(v, n);
    const factor = 2 ** n;
    return Math.floor(v * factor) / factor;
  }

  static ceil(v, n) {
    Dyadic._validateRange(v, n);
    const factor = 2 ** n;
    return Math.ceil(v * factor) / factor;
  }

  static trunc(v, n) {
    Dyadic._validateRange(v, n);
    const factor = 2 ** n;
    return Math.trunc(v * factor) / factor;
  }

  static round(v, n) {
    Dyadic._validateRange(v, n);
    const factor = 2 ** n;
    return Math.round(v * factor) / factor;
  }

  static even(v, n) {
    Dyadic._validateRange(v, n);
    const factor = 2 ** n;
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
