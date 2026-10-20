import {tis} from './tis.js';
//const UNINITV = Symbol(); // 未初期化値
//this._ = {INITV:get(){return UNINITV}};

const tryFn = (v,n='isFn') => {
    if ('function'!==typeof v) {throw new TypeError(`${n} は真偽値を返す関数であるべきです。:${v}`)}
    return v;
}
const tryBln = (v,n='nullable') => {
    if ('boolean'!==typeof v) {throw new TypeError(`${n} は真偽値であるべきです。:${v}`)}
    return v;
}
const tryAry = (v,n='isFnArgs') => {
    if (!Array.isArray(v)) {throw new TypeError(`${n} は真偽値であるべきです。:${v}`)}
    return v;
}
class Type { // 型
    #isFn; #dFn; #nullable; #isFnArgs;
//    constructor(isFn, dV=UNINITV, nullable=false, ...isFnArgs) {
    constructor(isFn, dFn, nullable=false, ...isFnArgs) {
        this.#nullable = tryBln(nullable);
        this.#isFnArgs = Object.freeze(tryAry(isFnArgs));
        this.#isFn = this.#mkFn(tryFn(isFn), nullable);
        this.#dFn = tryFn(dFn, 'dFn');
        this.#isFn(this.default);
    }
    #mkFn(isFn, nullable) {return nullable ? ((...args)=>null===args[0] || isFn(...args)) : isFn;}
    get isFn() {return this.#isFn}
    get default() {return this.#dFn(this.#isFn)}
    get nullable() {return this.#nullable}
    get isFnArgs() {return this.#isFnArgs}
    is(v)  {return this.#isFn(v, ...this.#isFnArgs)} // 真偽値
    try(v) { // 例外発生（trueの時は値を返す）
        if (!this.is(v)) {throw new TypeError(`args は isFn が真を返す値であるべきです。v:${}, args:${this.#.args}, isFn:${this.#isFn}`)}
        return v;
    }
    newV(mutable=false, onSet=Value.onSets.throw) {return new Value(this, mutable, onSet)}
    newLV(onInit, mutable=false, onSet=Value.onSets.throw) {return new LazyValue(this, onInit, mutable, onSet)}
    newLNV(C, mutable=false, onSet=Value.onSets.throw) {return new LazyNewValue(this, C, mutable, onSet)}
}
class LazyValue { // 遅延値（初期値の代入はinit()を呼び出すことで行う。initする前にget/setすると例外発生する）
    static {
        const S = Symbol();
        this._ = {INITV:get(){return S}};
    }
    static onSets = Object.freeze({
        throw: (s,x)=>s.type.try(...x),
        ignore: _=>true,
        default: (s,x)=>s.v=s.type.default,
    });
    #v; #type; #onInit; #mutable; #onSet;
    constructor(type, onInit, mutable=false, onSet=Value.onSets.throw) {
        this.#type = this.#tryType(type);
        this.#onSet = tryFn(onSet, 'onSet');
        this.#onInit = tryFn(onInit, 'onInit');
        this.#v = LazyValue._.INITV;
    }
    //init(...args) { this.#onInit(this, ...args); }
    init(...args) { this.#onInit(this, ...args); this.type.isFn(this.#v); }
    #tryType(t) {
        if (!(t instanceof Type)) {throw new TypeError(`type は Type 型インスタンスであるべきです。:${t}`)}
        return t;
    }
    #inited() {
        if (Value.INITV===this.#v) {throw new Error(`未初期化です。init()を呼び出してください。`)}
        return this.#v;
    }
    get type() {return this.#type;}
    get onSet() {return this.#onSet;}
    get v()  {return this.#inited();}
    set v(x) {
        this.#inited();
        this.#type.is(x) ? this.#v=x : this.#onSet([x], this);
    }
}
class Value extends LasyValue { // 即時初期化（Typeが持つdefault値を代入する）
    static #onInit = (...args)=>
    #v; #type; #onSet;
    constructor(type, mutable=false, onSet=Value.onSets.throw) {
        super(type, _=>this.type.default, mutable, onSet);
        this.init();
    }
}
class LasyNewValue extends LasyValue { // コンストラクタ実行
    #C;
    constructor(type, C, mutable=false, onSet=Value.onSets.throw) {
        super(type, (...args)=>new C(...args), mutable, onSet);
        this.#C = tryFn(C);
    }
    get C() {return this.#C}
}

/*
// 問題: Reference型はLasyValue/LasyNewValueのいずれかにすべき。
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
    // 以下はLazyValue/LazyNewValueのいずれかであるべき。またはNullableにするならValueでもOK。
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
*/
const dVFns = {
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
    // 以下はLazyValue/LazyNewValueのいずれかであるべき。またはNullableにするならValueでもOK。
    insN: _=>null,
    clsN: _=>null,
    runN: _=>null,
    fnN:  _=>null,
    // insは非NullableならLazyNewValueであるべき
    ins: (v,C=class{})=>new C(),
    // clsは非NullableならTypeのisFnArgsを指定したValueまたはLazyValueであるべき
    cls: _=>class{},
    run: _=>(()=>{}),
    fn: _=>(()=>{}),
    // いやでも、クラスか否かだけで良い場合と、特定クラスであるべき場合と、特定クラスまたは子孫クラスであるべき場合がある。
};
const dLVFns = {

}
