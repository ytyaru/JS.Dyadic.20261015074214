// test/num.js
import { describe, it, expect } from "bun:test";
import { int, fin, Range, SignedRange } from "../src/num.js";

describe("網羅的数値システムテスト (Int & Fin)", () => {
    
    it("関数としての int(v) および fin(v) の判定が正しく機能すること", () => {
        expect(int(100)).toBe(true);
        expect(int(1.5)).toBe(false);
        expect(int(Number.MAX_SAFE_INTEGER + 1)).toBe(false);

        expect(fin(100.5)).toBe(true);
        expect(fin(Infinity)).toBe(false);
        expect(fin(NaN)).toBe(false);
    });

    it("instanceof によるクラス階層の判別が意図通りに機能すること", () => {
        const rInt = int.rng(0, 10);
        const srInt = int.srng(-5, 5);
        const rFin = fin.rng(0, 10);

        expect(rInt instanceof int.Range).toBe(true);
        expect(rInt instanceof int.SignedRange).toBe(false);
        expect(srInt instanceof int.SignedRange).toBe(true);
        expect(rFin instanceof fin.Range).toBe(true);
        expect(rInt instanceof fin.Range).toBe(false);
    });

    const shortcuts = [
        { key: "s", min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, radix: 2, sign: true },
        { key: "u", min: 0, max: 9007199254740991, radix: 2, sign: false },
        { key: "s8", min: -128, max: 127, radix: 2, sign: true },
        { key: "u8", min: 0, max: 255, radix: 2, sign: false },
        { key: "s16", min: -32768, max: 32767, radix: 2, sign: true },
        { key: "u16", min: 0, max: 65535, radix: 2, sign: false },
        { key: "s32", min: -2147483648, max: 2147483647, radix: 2, sign: true },
        { key: "u32", min: 0, max: 4294967295, radix: 2, sign: false },
    ];

    it.each(shortcuts)("P2 ショートカットの検証: $key", (sc) => {
        const obj = int[sc.key];
        expect(obj.min).toBe(sc.min);
        expect(obj.max).toBe(sc.max);
        expect(obj.radix).toBe(sc.radix);
        expect(obj.sign).toBe(sc.sign);
    });

    // P2 の全有効範囲（-53 〜 53）の網羅テスト（一切省略なし）
    const p2ValidT = Array.from({ length: 107 }, (_, i) => i - 53);
    it.each(p2ValidT)("P2 の t=%i の網羅的パラメータおよび組み合わせテスト", (t) => {
        const p = int.p2(t);
        expect(p).toBeDefined();
        expect(p.radix).toBe(2);
        if (t === 0) {
            expect(p.min).toBe(Number.MIN_SAFE_INTEGER);
            expect(p.max).toBe(Number.MAX_SAFE_INTEGER);
            expect(p.sign).toBe(true);
        } else {
            expect(p.bit).toBe(Math.abs(t));
        }
    });

    // P10 の全有効範囲（-15 〜 15）の網羅テスト
    const p10ValidT = Array.from({ length: 31 }, (_, i) => i - 15);
    it.each(p10ValidT)("P10 の t=%i の網羅的パラメータテスト", (t) => {
        const p = int.p10(t);
        expect(p).toBeDefined();
        expect(p.radix).toBe(10);
        if (t !== 0) {
            expect(p.bit).toBe(Math.abs(t));
        }
    });

    const invalidTValues = [-54, 54, 3.5, "8", null];
    it.each(invalidTValues)("無効な P2 の t=%p に対して TypeError が送出されること", (t) => {
        expect(() => int.p2(t)).toThrow(TypeError);
    });

    const invalidP10T = [-16, 16, 1.5, "2"];
    it.each(invalidP10T)("無効な P10 の t=%p に対して TypeError が送出されること", (t) => {
        expect(() => int.p10(t)).toThrow(TypeError);
    });
});
