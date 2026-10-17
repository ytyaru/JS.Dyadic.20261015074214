// test/num.js
import { describe, it, expect } from "bun:test";
import { int, fin } from "../src/num.js";

describe("Numeric System Tests (Int & Fin)", () => {
    
    // 1. 基礎的な判定と assert のテスト
    describe("Base Validation & assert", () => {
        it("should validate int correctly", () => {
            expect(int.s8.is(0)).toBe(true);
            expect(int.s8.is(1.5)).toBe(false); // 整数ではない
            expect(int.s8.assert(10)).toBe(10);
            expect(() => int.s8.assert(1.5)).toThrow(TypeError);
        });

        it("should validate fin correctly", () => {
            expect(fin.p2(8).is(3.14)).toBe(true); // 有限数なら浮動小数点もOK
            expect(fin.p2(8).is(Infinity)).toBe(false);
            expect(fin.p2(8).is(NaN)).toBe(false);
            expect(fin.p2(8).assert(2.71)).toBe(2.71);
            expect(() => fin.p2(8).assert(Infinity)).toThrow(TypeError);
        });
    });

    // 2. カスタム Range のテスト
    describe("Custom Range (rng)", () => {
        it("should enforce min and max bounds", () => {
            const r = int.rng(10, 20);
            expect(r.min).toBe(10);
            expect(r.max).toBe(20);
            expect(r.is(10)).toBe(true);
            expect(r.is(15)).toBe(true);
            expect(r.is(20)).toBe(true);
            expect(r.is(9)).toBe(false);
            expect(r.is(21)).toBe(false);
        });

        it("should throw on invalid range arguments", () => {
            expect(() => int.rng(10, "20")).toThrow(TypeError);
        });
    });

    // 3. P2 (2のN乗) の網羅テスト
    describe("P2 Types and Shortcuts", () => {
        it("should handle s (t=0) and u (t=1) full safe ranges", () => {
            expect(int.s.min).toBe(Number.MIN_SAFE_INTEGER);
            expect(int.s.max).toBe(Number.MAX_SAFE_INTEGER);
            expect(int.u.min).toBe(0);
            expect(int.u.max).toBe(Number.MAX_SAFE_INTEGER);
        });

        it("should handle standard P2 shortcuts (s8, u8, s16, u16, s32, u32)", () => {
            // s8: t = -8 -> 2**8 = 256 -> min = -128, max = 127
            expect(int.s8.min).toBe(-128);
            expect(int.s8.max).toBe(127);
            expect(int.s8.radix).toBe(2);
            expect(int.s8.sign).toBe(false); // t < 0 => sign = false (0 < t is sign)
            expect(int.s8.bit).toBe(8);

            // u8: t = 8 -> 2**8 = 256 -> min = 0, max = 255
            expect(int.u8.min).toBe(0);
            expect(int.u8.max).toBe(255);
            expect(int.u8.sign).toBe(true);
            expect(int.u8.bit).toBe(8);

            // s16 / u16
            expect(int.s16.min).toBe(-32768);
            expect(int.s16.max).toBe(32767);
            expect(int.u16.min).toBe(0);
            expect(int.u16.max).toBe(65535);

            // s32 / u32
            expect(int.s32.min).toBe(-2147483648);
            expect(int.s32.max).toBe(2147483647);
            expect(int.u32.min).toBe(0);
            expect(int.u32.max).toBe(4294967295);
        });

        it("should support custom p2(t)", () => {
            const p = int.p2(4); // 2**4 = 16 (unsigned)
            expect(p.min).toBe(0);
            expect(p.max).toBe(15);
        });

        it("should throw on invalid P2 t parameter", () => {
            expect(() => int.p2(60)).toThrow(TypeError);
            expect(() => int.p2(-60)).toThrow(TypeError);
            expect(() => int.p2(3.5)).toThrow(TypeError);
        });
    });

    // 4. P10 (10のN乗) の網羅テスト
    describe("P10 Types and Shortcuts", () => {
        it("should handle t=0 full safe range", () => {
            expect(int.p10(0).min).toBe(Number.MIN_SAFE_INTEGER);
            expect(int.p10(0).max).toBe(Number.MAX_SAFE_INTEGER);
        });

        it("should handle custom p10(t)", () => {
            const p = int.p10(2); // 10**2 = 100 -> min = 0, max = 99
            expect(p.min).toBe(0);
            expect(p.max).toBe(99);

            const pNeg = int.p10(-2); // 10**-2 -> sign = false, factor = 100 -> min = -50, max = 49
            expect(pNeg.min).toBe(-50);
            expect(pNeg.max).toBe(49);
        });

        it("should throw on invalid P10 t parameter", () => {
            expect(() => int.p10(20)).toThrow(TypeError);
            expect(() => int.p10(-20)).toThrow(TypeError);
        });
    });

    // 5. Pe / Radix validation error tests
    describe("Radix and Parameter Validation", () => {
        it("should throw on invalid radix or non-integer t", () => {
            expect(() => int.rng(0, 10)).not.toThrow();
            // 直接Peクラス相当の検証（p2/p10経由以外の不正値チェック）
            expect(() => int.p2("abc")).toThrow(TypeError);
        });
    });

    // 6. Fin と Int の比較検証（FinでもP2/P10が同様に動作するか）
    describe("Fin System Parity", () => {
        it("should match P2 constraints in Fin system", () => {
            expect(fin.s8.min).toBe(-128);
            expect(fin.s8.max).toBe(127);
            expect(fin.s8.is(10)).toBe(true);
        });
    });
});
