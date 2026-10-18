import {tis} from './tis.js';
const tryFn = (v,n='isFn') => {
    if ('function'!==typeof v) {throw new TypeError(`${n} は真偽値を返す関数であるべきです。:${v}`)}
    return v;
}
class Type { // 型
    #isFn; #dFn;
    constructor(isFn, dFn) {
        this.#isFn = tryFn(isFn);
        this.#dFn = tryFn(dFn, 'dFn');
        this.#isFn(this.default);
    }
    get isFn() {return this.#isFn}
    get default() {return this.#dFn(this.#isFn)}
    is(...args)  {return this.#isFn(...args)} // 真偽値
    try(...args) { // 例外発生（trueの時は値を返す）
        if (!this.is(...args)) {throw new TypeError(`args は isFn が真を返す値であるべきです。v:${args}, isFn:${this.#isFn}`)}
        return 1===args.length ? args[0] : args;
    }
}
class Value { // 値
    static onSets = Object.freeze({
        throw: (x,s)=>s.type.try(...x),
        ignore: _=>true,
        default: (x,s)=>s.v=s.type.default,
    });
    #v; #type; #onSet;
    constructor(type, onSet=Value.onSets.throw) {
        this.#type = this.#tryType(type);
        this.#onSet = tryFn(onSet, 'onSet');
        this.#v = this.#type.default;
    }
    #tryType(t) {
        if (!(t instanceof Type)) {throw new TypeError(`type は Type 型インスタンスであるべきです。:${t}`)}
        return t;
    }
    get type() {return this.#type;}
    get onSet() {return this.#onSet;}
    get v()  {return this.#v;}
    set v(x) {
        this.#type.is(x) ? this.#v=x : this.#onSet([x], this);
     }
     set(...args) {
        if (0===args.length) {throw new Error(`引数に代入値を指定してください。`)}
        this.#type.is(...args) ? this.#v=args[0] : this.#onSet(args, this);
     }
 }
const dFns = {
    bln: _=>false,
    str: _=>'',
    big: _=>0n,
    sym: _=>Symbol(),
    num: _=>0,
    int: _=>0,
    flt: _=>0,
    ref: _=>{},
    obj: _=>{},
    nob: _=>Object.create(null),
    pob: _=>{},
    ary: _=>[],
    ins: (v,C=class{})=>new C(),
    cls: _=>class{},
    run: _=>(()=>{}),
    fn: _=>(()=>{}),
};
const D = Object.entries(tis).reduce((a,[k,isFn])=>{a.push({name:k, isFn:tis[k], dFn:dFns[k]}); return a;}, []);
// Nullable系
const DN = D.reduce((a,o)=>{if(!['nun','nul'].some(n=>n===o.name)){const d={...o}; d.name=d.name+'N'; d.isFn=v=>null===v || o.isFn(v); d.dFn=_=>null; a.push(d);} return a;}, []);
const T = {}
const V = {}
for (let d of [...D, ...DN]) {
    Object.defineProperty(T, d.name, {
        get(){return new Type(d.isFn, d.dFn)},
        enumerable: true,
    });
}
for (let k of Object.keys(T)) {
    console.log(k);
    Object.defineProperty(V, k, {
        get () {return new Value(T[k])},
        enumerable: true,
    });
}
export {Type,Value,T,V}
