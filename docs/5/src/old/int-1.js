//class Num {constructor(v) {if ('number'!==typeof v){throw new TypeError(`vはNumber型であるべきです。`)}}}
class Num {
    static #is = v=>'number'===typeof v;
    static is() {return this.#is}
    #is;
    constructor(is) {
        if (undefined===is) is = Num.is;
        if ('function'!==typeof is) {throw new TypeError(`isは真偽値を返却する関数であるべきです。`)}
        this.#is = is;
    }
}
class NInt extends Num {
    static #is = Number.isSafeInteger;
    static is() {return this.#is}
    constructor() {super(NInt.#is)}
}
class NFin extends Num {
    static #is = Number.isFinite;
    static is() {return this.#is}
    constructor() {super(NInt.#is)}
}
class Range extends Num {
    #is; #min; #max;
    constructor(is, min, max) {
        if ('function'!==typeof is) {throw new TypeError(`isは真偽値を返却する関数であるべきです。`)}
        if (![min,max].every(x=>is(x))) {throw new TypeError(`min,maxは両方共isが真を返却する値であるべきです。`)}
        this.#is = is;
        this.#min = min;
        this.#max = max;
    }
    is(...args) {return args.every(x=>is(x))}
    throw(...args) {
        if (!this.is(...args)) {throw new TypeError(`引数は全てisが真を返却する値であるべきです。`)}
        return 1===args.length ? args[0] : args;
    }
    get min() {return this.#min}
    get max() {return this.#max}
    get isFn() {return this.#is}
}
class RangeInt extends Range {
    constructor(min, max) {super(Number.isSafeInteger, min, max)}
}
class RangeFloat extends Range {
    constructor(min, max) {super(Number.isFinite, min, max)}
}
class PeInt extends RangeInt {// eのN乗なInt P=Power e=exponent(指数)
    #radix; #sign; #bit;
    static #validRadix(r) {
        if (!(Number.isSafeInteger(r) && 2<=r)) {throw new TypeError(`rは2以上の整数であるべきです。`)}
        return r;
    }
    static #validT(r) {
        if (!(Number.isSafeInteger(r))) {throw new TypeError(`tは整数であるべきです。`)}
        return t;
    }
    constructor(r,t) {
        PeInt.#validRadix(r);
        PeInt.#validT(t);
        const sign = 0<t;
        const bit = Math.abs(t);
        const factor = r ** bit;
        const min = sing ?  -(factor)/2    : 0;
        const max = sing ?  ((factor)/2)-1 : (factor)-1;
        super(min, max);
        this.#radix = r;
        this.#sign = sign;
        this.#bit  = bit;
    }
    get radix() {return this.#radix}
    get sign() {return this.#sign}
    get bit() {return this.#bit}
}
class P2Int extends PeInt {// 2のN乗なInt
    static #validT(t) {
        if (!(Number.isSafeInteger(x) && this.#t.some(c=>c===x))) {throw new TypeError(`tは ${this.#t} のいずれかのみ有効です。`)}
        return t;
    }
    static get s() {return new P2Int(0)}
    static get u() {return new P2Int(1)}
    static get s8() {return new P2Int(-8)}
    static get u8() {return new P2Int( 8)}
    static get s16() {return new P2Int(-16)}
    static get u16() {return new P2Int( 16)}
    static get s32() {return new P2Int(-32)}
    static get u32() {return new P2Int( 32)}
    static new(t) {return new P2Int(t)}
    constructor(t) {P2Int.#validT(t); super(2,t);}
}
class P10Int extends PeInt {// 2のN乗なInt
    constructor(t) {super(10,t)}

}
class P2Int extends RangeInt {// 2のN乗なInt
    #sign; #bit;
    static #t = [0,1,8,16,32,-8,-16,-32];
    static #validT(t) {
        if (!(Number.isSafeInteger(x) && this.#t.some(c=>c===x))) {throw new TypeError(`tは ${this.#t} のいずれかのみ有効です。`)}
        return t;
    }
    static get s() {return new P2Int(0)}
    static get u() {return new P2Int(1)}
    static get s8() {return new P2Int(-8)}
    static get u8() {return new P2Int( 8)}
    static get s16() {return new P2Int(-16)}
    static get u16() {return new P2Int( 16)}
    static get s32() {return new P2Int(-32)}
    static get u32() {return new P2Int( 32)}
    static new(t) {return new P2Int(t)}
    //constructor(t) {super(min, max)}
    constructor(t) {
        this.#validT(t);
        this.#sign = 0<t;
        this.#bit = Math.abs(t);
        const min = this.#sing ?  -(2**this.#bit)/2    : 0;
        const max = this.#sing ?  ((2**this.#bit)/2)-1 : (2**this.#bit)-1;
        super(min, max);
    }
}
const int = {
    get s() {return new P2Int(0)}
    get u() {return new P2Int(1)}
    get s8() {return new P2Int(-8)}
    get u8() {return new P2Int( 8)}
    get s16() {return new P2Int(-16)}
    get u16() {return new P2Int( 16)}
    get s32() {return new P2Int(-32)}
    get u32() {return new P2Int( 32)}
    p2(t) {return new P2Int(t)}
    p10(t) {return new P2Int(t)}
    new(min,max) {return new RangeInt(min,max)}
}
class Int {
    #sign; #bit;
    static #t = [0,1,8,16,32,-8,-16,-32];
    static #validT(t) {
        if (!(Number.isSafeInteger(x) && this.#t.some(c=>c===x))) {throw new TypeError(`tは ${this.#t} のいずれかのみ有効です。`)}
        return t;
    }
    static get s() {return new P2Int(0)}
    static get u() {return new P2Int(1)}
    static get s8() {return new P2Int(-8)}
    static get u8() {return new P2Int( 8)}
    static get s16() {return new P2Int(-16)}
    static get u16() {return new P2Int( 16)}
    static get s32() {return new P2Int(-32)}
    static get u32() {return new P2Int( 32)}
    static new(min,max) {return new RangeInt(min,max)}
    new(min,max) {
        this.throw()
    }

    constructor(sign, ) {
//    constructor(t) {
        this.#validT(t);
        this.#sign = 0<t;
        this.#bit = Math.abs(t);
    }
}
