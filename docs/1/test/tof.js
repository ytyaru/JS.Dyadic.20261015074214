// math.test.js
import { expect, test, describe } from "bun:test";
import { tof } from "../src/tof.js";

class C {static sm() {} static *sgm() {yield 0}}
describe("tof", () => {
    test("nun", () => {
        expect(tof(undefined)).toBe('Undefined');
        expect(tof(null)).toBe('Null');
        //expect(tof(NaN)).toBe('Number.NaN');
        expect(tof(NaN)).toBe('NaN');
    });
    test("bln", () => {
        expect(tof(false)).toBe('Boolean');
        expect(tof(true)).toBe('Boolean');
    });
    test("num", () => {
        /*
        expect(tof(Infinity)).toBe('Number.Infinity.Positive');
        expect(tof(-Infinity)).toBe('Number.Infinity.Negative');
        expect(tof(0.1)).toBe('Number.Finite');
        expect(tof(0)).toBe('Number.Integer');
        expect(tof(Number.MAX_SAFE_INTEGER+1)).toBe('Number.Over');
        */
        expect(tof(Infinity)).toBe('Infinity.Positive');
        expect(tof(-Infinity)).toBe('Infinity.Negative');
        expect(tof(0.1)).toBe('Finite');
        expect(tof(0)).toBe('Integer');
        expect(tof(Number.MAX_SAFE_INTEGER+1)).toBe('OverNumber');
    });
    test("big", () => {
        expect(tof(0n)).toBe('BigInt');
    });
    test("str", () => {
        expect(tof('')).toBe('String');
    });
    test("sym", () => {
        expect(tof(Symbol())).toBe('Symbol');
    });

    test("PlainObject", () => {
        expect(tof({})).toBe('Object.Plain');
    });
    test("NonePrototypeObject", () => {
        expect(tof(Object.create(null))).toBe('Object.NonePrototype');
    });
    test("Array", () => {
        expect(tof([])).toBe('Array');
    });
    test("Boxed", () => {
        expect(tof(new Boolean())).toBe('Instance<Boolean>');
        expect(tof(new Number())).toBe('Instance<Number>');
        expect(tof(new String())).toBe('Instance<String>');
    });
    test("Instance", () => {
        expect(tof(new Boolean())).toBe('Instance<Boolean>');
        expect(tof(new Number())).toBe('Instance<Boolean>');
        expect(tof(new String())).toBe('Instance<Boolean>');
    });








});
