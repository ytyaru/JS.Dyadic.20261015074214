// src/num.js

export class Num {
    #isFn;
    constructor(isFn = Number.isFinite) { this.#isFn = isFn; }
    is(v) { return this.#isFn(v); }
    assert(...args) {
        if (!args.every(x => this.is(x))) {
            throw new TypeError(`引数は全てisが真を返却する値であるべきです。`);
        }
        return 1 === args.length ? args[0] : args;
    }
}

export class Range extends Num {
    #min; #max;
    constructor(min, max, isFn = Number.isFinite) {
        super(isFn);
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

export class SignedRange extends Range {
    #sign;
    constructor(min, max, isFn = Number.isFinite) {
        super(min, max, isFn);
        this.#sign = [min, max].some(x => x < 0);
    }
    get sign() { return this.#sign; }
}

// 判定関数（isFn）ごとに数空間オブジェクトを生成するファクトリー
function createNumericSpace(isFn, suffix) {
    const makeTypedClass = (Base) => {
        const prefix = Base === Range ? '' : 'Signed';
        const name = `${prefix}Range${suffix}`;
        return {
            [name]: class extends Base {
                constructor(min, max) { super(min, max, isFn); }
            }
        }[name];
    };

    const TypedRange = makeTypedClass(Range);
    const TypedSignedRange = makeTypedClass(SignedRange);

    class Pe extends TypedSignedRange {
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
            if (0 === t) return new TypedSignedRange(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

            Pe.#validRadix(r);
            Pe.#validT(t);
            const sign = 0 > t;
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
        static get u() { return new this(53); }
        static get s8() { return new this(-8); }
        static get u8() { return new this( 8); }
        static get s16() { return new this(-16); }
        static get u16() { return new this( 16); }
        static get s32() { return new this(-32); }
        static get u32() { return new this( 32); }
        static new(t) { return new this(t); }

        constructor(t) {
            if (1 === t) t = 53;
            P2.#validT(t);
            super(2, t);
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
            P10.#validT(t);
            super(10, t);
        }
    }

    const fo = v => isFn(v) && (Number.MIN_SAFE_INTEGER <= v && v <= Number.MAX_SAFE_INTEGER);
    Object.assign(fo, {
        Range: TypedRange,
        SignedRange: TypedSignedRange,
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
        rng(min, max) { return new TypedRange(min, max); },
        srng(min, max) { return new TypedSignedRange(min, max); }
    });

    return fo;
}

// 綺麗に名前空間としてエクスポート
export const int = createNumericSpace(Number.isSafeInteger, 'Int');
export const fin = createNumericSpace(Number.isFinite, 'Fin');
