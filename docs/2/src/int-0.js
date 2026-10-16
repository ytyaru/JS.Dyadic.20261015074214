class Int {
    #sign; #bit;
    static #t = [0,1,8,16,32,-8,-16,-32];
    static #T = Object.freeze({
        s: 0,
        u: 1,
        ...(this.#t.reduce((o,v)=>{o[(v<0 ? 's' : 'u')+Math.abs(v)]=v;return o;},{})),
    });
    static #validT(t) {
        if (!(Number.isSafeInteger(x) && this.#t.some(c=>c===x))) {throw new TypeError(`tは ${this.#t} のいずれかのみ有効です。`)}
        return t;
    }
    static {
        this.#T.
    }
//    static get s() {return new Int(0)}
//    static get u() {return new Int(1)}
    constructor(t) {
        this.#validT(t);
        this.#sign = 0<t;
        this.#bit = Math.abs(t);
    }
}
