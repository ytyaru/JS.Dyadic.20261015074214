// src/num.js
function createNumericSystem(isFn) {
    class Num {
        #isFn;
        constructor() { this.#isFn = isFn; }
        is(v) { return this.#isFn(v); }
        assert(...args) {
            if (!args.every(x => this.is(x))) {
                throw new TypeError(`引数は全てisが真を返却する値であるべきです。`);
            }
            return 1 === args.length ? args[0] : args;
        }
    }

    class Range extends Num {
        #min; #max;
        constructor(min, max) {
            super();
            if (![min, max].map(x => super.is(x)).every(Boolean)) {
                throw new TypeError(`min, maxは両方共isが真を返却する値であるべきです。`);
            }
            this.#min = min;
            this.#max = max;
        }
        is(...args) { return args.every(x => super.is(x) && x >= this.#min && x <= this.#max); }
        get min() { return this.#min; }
        get max() { return this.#max; }
    }

    class SignedRange extends Range {
        #sign;
        constructor(min, max) {
            super(min, max);
            this.#sign = [min, max].some(x => x < 0);
        }
        get sign() { return this.#sign; }
    }

    class Pe extends SignedRange {
        #radix; #bit;
        static #validRadix(r) {
            if (!(Number.isSafeInteger(r) && 2 <= r)) {
                throw new TypeError(`rは2以上の整数であるべきです。`);
            }
            return r;
        }
        static #validT(t) {
            if (!(Number.isSafeInteger(t))) {
                throw new TypeError(`tは整数であるべきです。`);
            }
            return t;
        }
        constructor(r, t) {
            Pe.#validRadix(r);
            Pe.#validT(t);
            const sign = 0 > t; // t < 0
            const bit = Math.abs(t);
            const factor = r ** bit;
            const min = sign ? -(factor) / 2 : 0;
            const max = sign ? ((factor) / 2) - 1 : (factor) - 1;
            super(min, max);
            this.#radix = r;
            this.#bit = bit;
        }
        get radix() { return this.#radix; }
        get bit() { return this.#bit; }
    }

    class P2 extends Pe {
        static #validT(t) {
            if (!(Number.isSafeInteger(t) && -53 <= t && t <= 53)) {
                throw new TypeError(`tは -53〜53 までの整数のみ有効です。`);
            }
            return t;
        }
        static get s() { return new this(0); }
        static get u() { return new this(1); }
        static get s8() { return new this(-8); }
        static get u8() { return new this( 8); }
        static get s16() { return new this(-16); }
        static get u16() { return new this( 16); }
        static get s32() { return new this(-32); }
        static get u32() { return new this( 32); }
        static new(t) { return new this(t); }

        constructor(t) {
            return 0 === t ? new SignedRange(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
                 : 1 === t ? new SignedRange(0, Number.MAX_SAFE_INTEGER)
                 : (P2.#validT(t), super(2, t));
        }
    }

    class P10 extends Pe {
        static #validT(t) {
            if (!(Number.isSafeInteger(t) && -15 <= t && t <= 15)) {
                throw new TypeError(`tは -15〜15 までの整数のみ有効です。`);
            }
            return t;
        }
        static new(t) { return new this(t); }

        constructor(t) {
            return 0 === t ? new SignedRange(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
                 : (P10.#validT(t), super(10, t));
        }
    }

    return {
        get s() { return P2.s; },
        get u() { return P2.u; },
        get s8() { return P2.s8; },
        get u8() { return P2.u8; },
        get s16() { return P2.s16; },
        get u16() { return P2.u16; },
        get s32() { return P2.s32; },
        get u32() { return P2.u32; },
        p2(t) { return P2.new(t); },
        p10(t) { return P10.new(t); },
        pe(r, t) { return new Pe(r, t); },
        rng(min, max) { return new Range(min, max); }
    };
}

// トップレベルでのクラス群のexport
export { Num, Range, SignedRange, Pe, P2, P10 };

export const int = createNumericSystem(Number.isSafeInteger);
export const fin = createNumericSystem(Number.isFinite);
export const fin = createNumericSystem(Number.isFinite);
