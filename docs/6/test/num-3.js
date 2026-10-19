// test/num.js
import { describe, it, expect } from "bun:test";
import { int, fin } from "../src/num.js";

describe("Exhaustive Numeric System Tests (Int & Fin)", () => {

    describe("Base Validation and assert behavior", () => {
        const testValues = [-1000, -1, 0, 1, 1000, 3.14, Infinity, -Infinity, NaN, "10", null, undefined];
        
        it("should correctly identify safe integers for int system", () => {
            for (const v of testValues) {
                const expected = Number.isSafeInteger(v);
                expect(int.s.is(v)).toBe(expected);
            }
        });

        it("should correctly identify finite numbers for fin system", () => {
            for (const v of testValues) {
                const expected = Number.isFinite(v);
                expect(fin.s.is(v)).toBe(expected);
            }
        });

        it("should assert valid values and throw TypeError on invalid values", () => {
            expect(int.s8.assert(10)).toBe(10);
            expect(() => int.s8.assert(3.14)).toThrow(TypeError);
            expect(() => int.s8.assert("10")).toThrow(TypeError);
        });
    });

    describe("Custom Range Exhaustive Bounds", () => {
        const boundaryPairs = [
            [-10, 10],
            [0, 100],
            [-53, 53],
            [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
            [5, 5]
        ];

        it.each(boundaryPairs)("should correctly enforce range [%i, %i]", (min, max) => {
            const r = int.rng(min, max);
            expect(r.min).toBe(min);
            expect(r.max).toBe(max);

            if (Number.isSafeInteger(min) && Number.isSafeInteger(max)) {
                expect(r.is(min)).toBe(true);
                expect(r.is(max)).toBe(true);
                if (min > Number.MIN_SAFE_INTEGER) expect(r.is(min - 1)).toBe(false);
                if (max < Number.MAX_SAFE_INTEGER) expect(r.is(max + 1)).toBe(false);
            }
        });

        const invalidInputs = [
            [10, "20"],
            ["10", 20],
            [null, 10],
            [10, undefined],
            [3.14, 10]
        ];
        it.each(invalidInputs)("should throw TypeError for invalid range arguments: [%s, %s]", (min, max) => {
            expect(() => int.rng(min, max)).toThrow(TypeError);
        });
    });

    describe("P2 Exhaustive t-parameter and combination tests", () => {
        it("should validate s (t=0) and u (t=1) full safe ranges", () => {
            expect(int.s.min).toBe(Number.MIN_SAFE_INTEGER);
            expect(int.s.max).toBe(Number.MAX_SAFE_INTEGER);
            expect(int.u.min).toBe(0);
            expect(int.u.max).toBe(Number.MAX_SAFE_INTEGER);
        });

        const shortcuts = [
            { key: "s8", min: -128, max: 127, radix: 2, sign: false, bit: 8 },
            { key: "u8", min: 0, max: 255, radix: 2, sign: true, bit: 8 },
            { key: "s16", min: -32768, max: 32767, radix: 2, sign: false, bit: 16 },
            { key: "u16", min: 0, max: 65535, radix: 2, sign: true, bit: 16 },
            { key: "s32", min: -2147483648, max: 2147483647, radix: 2, sign: false, bit: 32 },
            { key: "u32", min: 0, max: 4294967295, radix: 2, sign: true, bit: 32 },
        ];

        it.each(shortcuts)("should verify P2 shortcut: $key", (sc) => {
            const obj = int[sc.key];
            expect(obj.min).toBe(sc.min);
            expect(obj.max).toBe(sc.max);
            expect(obj.radix).toBe(sc.radix);
            expect(obj.sign).toBe(sc.sign);
            expect(obj.bit).toBe(sc.bit);
            
            expect(obj.is(sc.min)).toBe(true);
            expect(obj.is(sc.max)).toBe(true);
            if (sc.min > Number.MIN_SAFE_INTEGER) expect(obj.is(sc.min - 1)).toBe(false);
            if (sc.max < Number.MAX_SAFE_INTEGER) expect(obj.is(sc.max + 1)).toBe(false);
        });

        // t の有効範囲内 (-53 〜 52 ※実装上の上限未満仕様に合致) のテスト
        const validP2T = Array.from({ length: 106 }, (_, i) => i - 53).filter(t => t !== 0 && t !== 1 && t < 53);
        it.each(validP2T)("should dynamically validate P2 with t=%i", (t) => {
            const p = int.p2(t);
            expect(typeof p.min).toBe("number");
            expect(typeof p.max).toBe("number");
            expect(p.bit).toBe(Math.abs(t));
        });

        const invalidTValues = [-54, 53, 54, 3.5, "8", null];
        it.each(invalidTValues)("should throw TypeError for invalid P2 t=%p", (t) => {
            expect(() => int.p2(t)).toThrow(TypeError);
        });
    });

    describe("P10 Exhaustive t-parameter tests", () => {
        const validP10T = Array.from({ length: 30 }, (_, i) => i - 15).filter(t => t !== 0 && t < 15);
        it.each(validP10T)("should validate P10 with t=%i", (t) => {
            const p = int.p10(t);
            expect(typeof p.min).toBe("number");
            expect(typeof p.max).toBe("number");
            expect(p.radix).toBe(10);
            expect(p.bit).toBe(Math.abs(t));
        });

        const invalidP10T = [-16, 15, 16, 1.5, "2"];
        it.each(invalidP10T)("should throw TypeError for invalid P10 t=%p", (t) => {
            expect(() => int.p10(t)).toThrow(TypeError);
        });
    });

    describe("Int and Fin Parity Tests", () => {
        const targets = ["s8", "u8", "s16", "u16", "s32", "u32", "s", "u"];
        it.each(targets)("should have identical min/max bounds for %s between Int and Fin", (key) => {
            expect(fin[key].min).toBe(int[key].min);
            expect(fin[key].max).toBe(int[key].max);
        });
    });
});
