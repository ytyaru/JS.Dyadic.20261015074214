const tryFn = (v,n='isFn') => {
    if ('funtion'!==typeof v) {throw new TypeError(`${n} は真偽値を返す関数であるべきです。`)}
    return v;
}
class Type { // 型
    #isFn; #dFn;
    //constructor(isFn, dFn) {this.#isFn = tryFn(isFn); this.#dFn = tryFn(dFn);}
    constructor(isFn, dFn) {
        this.#isFn = tryFn(isFn);
        this.#dFn = tryFn(dFn);
        this.#isFn(this.default);
    }
    get isFn() {return this.#isFn}
    is(v)  {return this.#isFn(v)} // 真偽値
    try(v) { // 例外発生（trueの時は値を返す）
        if (!this.is(v)) {throw new TypeError(`vはisFnが真を返す値であるべきです。v:${v}, isFn:${this.#isFn}`)}
        return v;
    }
    get default() {return this.#dFn(this.#isFn)}
}
class Value { // 値
    static onSets = Object.freeze({
        throw: (x,s)=>s.type.try(x),
        ignore: _=>true,
        default: (x,s)=>s.v=s.type.default,
    });
    #v; #type; #onSet;
    constructor(type, onSet=Value.onSets.throw) {
        this.#type = this.#tryType(type);
        this.#onSet = tryFn(onSet, 'onSet');
        this.#v = this.#type.default;
    }
    #tryType(v) {
        if (!(type instanceof Type)) {throw new TypeError(`type はType型インスタンスであるべきです。`)}
        return v;
    }
    get type() {return this.#type;}
    get onSet() {return this.#onSet;}
    get v()  {return this.#v;}
    set v(x) {
//        if (this.#type.is(x)) {this.#v=x;}
//        else {this.#onSet(x, this)}
        this.#type.is(x) ? this.#v=x : this.#onSet(x, this);
     }
}
const isO = v => null!==v && 'object'===typeof v;
const D = [
    {name:'bln', isFn:v=>'boolean'===typeof v, dFn:_=>false},
    {name:'str', isFn:v=>'string' ===typeof v, dFn:_=>''},
    {name:'big', isFn:v=>'bigint' ===typeof v, dFn:_=>0n},
    {name:'sym', isFn:v=>'symbol' ===typeof v, dFn:_=>Symbol()},
    {name:'num', isFn:v=>'number' ===typeof v, dFn:_=>0},
    {name:'int', isFn:Number.isSafeInteger, dFn:_=>0},
    {name:'flt', isFn:v=>Number.isFinite(v) && (Number.MIN_SAFE_INITEGER<=v && v<=Number.MAX_SAFE_INITEGER), dFn:_=>0},
    {name:'ref', isFn:v=>'function object'.split(' ').some(n=>n===typeof v), dFn:_=>null},
    {name:'run', isFn:v=>'function' ===typeof v, dFn:_=>null},
    {name:'obj', isFn:isO, dFn:_=>null},
    {name:'pob', isFn:v=>isO(v) && Object.prototype===Object.getPrototypeOf(v), dFn:_=>null},
    {name:'nob', isFn:v=>isO(v) && null            ===Object.getPrototypeOf(v), dFn:_=>null},
    {name:'ary', isFn:Array.isArray, dFn:_=>null},
    // cls, ins, fnも追加したいが処理が複雑なため保留
];
// Nullable系
//const DN = D.map(d=>{d.isFn=v=>null===v || d.isFn(v)})
const DN = D.reduce((a,o)=>{const d={...o}; d.isFn=v=>null===v || o.isFn(v); d.dFn:_=>null; a.push(d); return a;}, []);
const T = {}
const V = {}
for (let d of [...D, ...DN]) {
    Object.defineProperty(T, d.name, {
        get(){return new Type(d.isFn, d.dFn)}
    });
}
for (let k of Object.keys(T)) {
    Object.defineProperty(V, k, {
        get () {return new Value(new T[k]())}
    });
}

const T = {
    get bln() {return new Type(v=>'boolean'===typeof v, _=>false)},
    get str() {return new Type(v=>'string' ===typeof v, _=>'')},
    get big() {return new Type(v=>'bigint' ===typeof v, _=>0n)},
    get sym() {return new Type(v=>'symbol' ===typeof v, _=>Symbol())},
    get num() {return new Type(v=>'number' ===typeof v, _=>0)},
    get int() {return new Type(v=>Number.isSafeInteger(v), _=>0)},
    get fin() {return new Type(v=>Number.isFinite(v) && (Number.MIN_SAFE_INITEGER<=v && v<=Number.MAX_SAFE_INITEGER), _=>0)},
    get ref() {return new Type(v=>'function object'.split(' ').some(n=>n===typeof v), _=>null)},
    get run() {return new Type(v=>'function' ===typeof v, _=>null)},
    get obj() {return new Type(v=>null!==v && 'object'===typeof v, _=>null)},
    get pob() {return new Type(v=>null!==v && 'object'===typeof v && Object.prototype===Object.getPrototypeOf(v), _=>{})},
    get nob() {return new Type(v=>null!==v && 'object'===typeof v && null===Object.getPrototypeOf(v), _=>Object.create(null))},
    get ary() {return new Type(v=>Array.isArray(v), _=>[])},
    // cls, ins, fnも追加したい

    get und() {return new Type(v=>undefined===v, _=>undefined)},
    get nul() {return new Type(v=>null===v, _=>null)},
    get nan() {return new Type(v=>Number.isNaN(v), _=>NaN)},
};
const V = {
    get bln() {return new Value(T.bln)}
};
