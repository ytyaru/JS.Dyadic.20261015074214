import { describe, test, expect } from "bun:test";
import { Dyadic } from "../src/daydic.js";

describe("Dyadic Utility Class Tests", () => {
  
  describe("1. コンストラクタとバリデーション (precision)", () => {
    test("正常な精度でインスタンス化できること", () => {
      const d = new Dyadic(3);
      expect(d.precision).toBe(3);
    });

    test("負の精度を指定すると RangeError が発生すること", () => {
      expect(() => new Dyadic(-1)).toThrow(RangeError);
    });

    test("整数以外の精度を指定すると RangeError が発生すること", () => {
      expect(() => new Dyadic(1.5)).toThrow(RangeError);
      expect(() => new Dyadic("3")).toThrow(RangeError);
      expect(() => new Dyadic(3n)).toThrow(RangeError);
    });
  });

  describe("2. 静的 API (Static Methods)", () => {
    test("Dyadic.step() が正しい値を返すこと", () => {
      expect(Dyadic.step(0)).toBe(1);
      expect(Dyadic.step(1)).toBe(0.5);
      expect(Dyadic.step(3)).toBe(0.125);
    });

    test("Dyadic.step() に不正な精度を渡すとエラーになること", () => {
      expect(() => Dyadic.step(-1)).toThrow(RangeError);
      expect(() => Dyadic.step("invalid")).toThrow(RangeError);
    });

    test("Dyadic.range() が正しい最小・最大値を返すこと", () => {
      const { min, max } = Dyadic.range(1);
      expect(min).toBe(-Number.MAX_SAFE_INTEGER / 2);
      expect(max).toBe(Number.MAX_SAFE_INTEGER / 2);
    });

    test("Dyadic.is() がダイアド数を正しく判定すること", () => {
      // precision = 2 (step = 0.25)
      expect(Dyadic.is(0.25, 2)).toBe(true);
      expect(Dyadic.is(0.5, 2)).toBe(true);
      expect(Dyadic.is(0.3, 2)).toBe(false);
      expect(Dyadic.is(NaN, 2)).toBe(false);
      expect(Dyadic.is(Infinity, 2)).toBe(false);
    });
  });

  describe("3. 静的丸め API (Static Rounding Methods)", () => {
    const p = 2; // step = 0.25

    test("floor", () => {
      expect(Dyadic.floor(0.4, p)).toBe(0.25);
      expect(Dyadic.floor(-0.4, p)).toBe(-0.5);
    });

    test("ceil", () => {
      expect(Dyadic.ceil(0.3, p)).toBe(0.5);
      expect(Dyadic.ceil(-0.3, p)).toBe(-0.25);
    });

    test("trunc", () => {
      expect(Dyadic.trunc(0.6, p)).toBe(0.5);
      expect(Dyadic.trunc(-0.6, p)).toBe(-0.5);
    });

    test("round", () => {
      expect(Dyadic.round(0.375, p)).toBe(0.5); // 0.375 -> 1.5 scaled -> rounds to 2 scaled -> 0.5
      expect(Dyadic.round(0.3, p)).toBe(0.25);
    });

    test("even (銀行家ズ・丸め)", () => {
      // scaled value checks
      // 0.375 * 4 = 1.5 -> even rounds to 2 -> 0.5
      expect(Dyadic.even(0.375, p)).toBe(0.5);
      // 0.125 * 4 = 0.5 -> even rounds to 0 -> 0
      expect(Dyadic.even(0.125, p)).toBe(0.0);
    });

    test("無効な値や範囲外の入力でエラーになること", () => {
      expect(() => Dyadic.floor("abc", p)).toThrow(TypeError);
      expect(() => Dyadic.floor(Number.MAX_VALUE, p)).toThrow(RangeError);
    });
  });

  describe("4. インスタンス API (Instance Methods & Getters)", () => {
    const d = new Dyadic(2); // precision = 2 (step = 0.25)

    test("ゲッターが正しく機能すること", () => {
      expect(d.precision).toBe(2);
      expect(d.step).toBe(0.25);
      expect(d.range.min).toBe(-Number.MAX_SAFE_INTEGER / 4);
    });

    test("インスタンスの is() メソッド", () => {
      expect(d.is(0.25)).toBe(true);
      expect(d.is(0.3)).toBe(false);
      expect(() => d.is("invalid")).toThrow(TypeError);
    });

    test("インスタンスの丸めメソッド群", () => {
      expect(d.floor(0.4)).toBe(0.25);
      expect(d.ceil(0.3)).toBe(0.5);
      expect(d.trunc(0.6)).toBe(0.5);
      expect(d.round(0.3)).toBe(0.25);
      expect(d.even(0.125)).toBe(0.0);
    });

    test("インスタンスメソッドで範囲外の値を渡すと RangeError になること", () => {
      expect(() => d.floor(Number.MAX_VALUE)).toThrow(RangeError);
    });
  });
});
