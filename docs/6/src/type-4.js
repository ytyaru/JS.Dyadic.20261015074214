import {tis} from './tis.js';
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
    constructor(isFn, dFn, nullable=false, ...isFnArgs) {
        this.#nullable = tryBln(nullable);
        this.#isFnArgs = Object.freeze(tryAry(isFnArgs));
        this.#isFn = this.#mkFn(tryFn(isFn), nullable);
        this.#dFn = tryFn(dFn, 'dFn');
        this.#isFn(this.default);
        /*
        this.#isFn = tryFn(isFn);
        this.#dFn = tryFn(dFn, 'dFn');
        this.#isFn(this.default);
        this.#nullable = tryBln(nullable);
        this.#isFnArgs = tryAry(isFnArgs);
        */
    }
    #mkFn(isFn, nullable) {return nullable ? ((...args)=>null===args[0] || isFn(...args)) : isFn;}
    get isFn() {return this.#isFn}
    get default() {return this.#dFn(this.#isFn)}
    get nullable() {return this.#nullable}
    get isFnArgs() {return this.#isFnArgs}
    /*
    is(...args)  {return this.#isFn(...args)} // 真偽値
    try(...args) { // 例外発生（trueの時は値を返す）
        if (!this.is(...args)) {throw new TypeError(`args は isFn が真を返す値であるべきです。v:${args}, isFn:${this.#isFn}`)}
        return 1===args.length ? args[0] : args;
    }
    */
    is(v)  {return this.#isFn(v, ...this.#isFnArgs)} // 真偽値
    try(v) { // 例外発生（trueの時は値を返す）
        if (!this.is(v)) {throw new TypeError(`args は isFn が真を返す値であるべきです。v:${}, args:${this.#.args}, isFn:${this.#isFn}`)}
        return v;
    }
    newV(mutable=false, onSet=Value.onSets.throw) {return new Value(this, mutable, onSet)}
    newLV(mutable=false, onSet=Value.onSets.throw) {return new LazyValue(this, mutable, onSet)}
    newLNV(mutable=false, onSet=Value.onSets.throw) {return new LazyNewValue(this, mutable, onSet)}
}
/*
class Value { // 値
    static onSets = Object.freeze({
        throw: (x,s)=>s.type.try(...x),
        ignore: _=>true,
        default: (x,s)=>s.v=s.type.default,
    });
    #v; #type; #onSet;
    constructor(type, mutable=false, onSet=Value.onSets.throw) {
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
*/
class Value { // 値
    static {
        const S = Symbol();
        this._ = {INITV:get(){return S}};
    }
    static onSets = Object.freeze({
        throw: (x,s)=>s.type.try(...x),
        ignore: _=>true,
        default: (x,s)=>s.v=s.type.default,
    });
    #v; #type; #onSet;
    constructor(type, mutable=false, onSet=Value.onSets.throw) {
        // protected
//        this._ = {v,type,onSet}
//        this._ = {v:(x)=>this.#v=x}
        this._ = {initV:_=>this.#v=Value.INITV}
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
    /*
    set(...args) {
        if (0===args.length) {throw new Error(`引数に代入値を指定してください。`)}
        this.#type.is(...args) ? this.#v=args[0] : this.#onSet(args, this);
    }
    */
}

class LazyValue extends Value { // 遅延値
    #initFn;
    constructor(type, onInit, mutable=false, onSet=Value.onSets.throw) {
        super(type, mutable, onSet);
        this.#onInit = tryFn(onInit, 'onInit');
        this._.initV();
    }
    init(...args) { return this.#onInit(...args); }
    #inited() {
        if (Value.INITV===this.v) {throw new Error(`未初期化です。init()を呼び出してください。`)}
        return this.v;
    }
    get v()  {return this.#inited();}
    set v(x) {
        this.#inited();
        super.v = x;
    }
}

/*
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
*/
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
