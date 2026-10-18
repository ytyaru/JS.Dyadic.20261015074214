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
/*
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
const DN = D.reduce((a,o)=>{const d={...o}; d.name=d.name+'N'; d.isFn=v=>null===v || o.isFn(v); d.dFn=_=>null; a.push(d); return a;}, []);
const T = {}
const V = {}
for (let d of [...D, ...DN]) {
//    console.log(d.name);
    Object.defineProperty(T, d.name, {
        get(){return new Type(d.isFn, d.dFn)}
    });
}
for (let k of Object.keys(T)) {
    Object.defineProperty(V, k, {
        get () {return new Value(new T[k]())}
    });
}
export {Type,Value,T,V}
*/
/*
//const Defaults = Object.entries(tis).reduce((o,[k,v])=>{o[k]; return o;}, {});
const Defaults = [
    {n:'bln', dFn:_=>false},
    {n:'str', dFn:_=>''},
    {n:'big', dFn:_=>0n},
    {n:'sym', dFn:_=>Symbol()},
    {n:'num', dFn:_=>0},
    {n:'int', dFn:_=>0},
    {n:'flt', dFn:_=>0},
    {n:'ref', dFn:_=>null},
    {n:'run', dFn:_=>null},
    {n:'obj', dFn:_=>null},
    {n:'nob', dFn:_=>null},
    {n:'pob', dFn:_=>{}},
    {n:'ary', dFn:_=>[]},
    {n:'ins', dFn:_=>null},
    {n:'cls', dFn:_=>null},
    {n:'run', dFn:_=>null},
    {n:'fn', dFn:_=>null},
    // cls, ins, fnも追加したいが処理が複雑なため保留
];
*/
const dFns = {
    bln: _=>false,
    str: _=>'',
    big: _=>0n,
    sym: _=>Symbol(),
    num: _=>0,
    int: _=>0,
    flt: _=>0,
    ref: _=>null,
    run: _=>null,
    obj: _=>null,
    nob: _=>null,
    pob: _=>{},
    ary: _=>[],
    ins: _=>null,
    cls: _=>null,
    run: _=>null,
    fn: _=>null,
};
//cons dnFns = Object.entries(dFns).reduce((o,[k,v])=>{o[k+'N']=; return o;}, {});
//const D = Object.entries(tis).reduce((a,[k,isFn])=>{const d={...o}; d.name=k; d.isFn=tis[k]; d.dFn=dFns[k]; a.push(d); return a;}, []);
const D = Object.entries(tis).reduce((a,[k,isFn])=>{a.push({name:k, isFn:tis[k], dFn:dFns[k]}); return a;}, []);
// Nullable系
const DN = D.reduce((a,o)=>{const d={...o}; d.name=d.name+'N'; d.isFn=v=>null===v || o.isFn(v); d.dFn=_=>null; a.push(d); return a;}, []);
// 以下は最初からNullableなので論理的に不要のため削除する
delete DN.nunN; 
delete DN.nulN;
//delete DN.undN;
//delete DN.nanN;
const T = {}
const V = {}
for (let d of [...D, ...DN]) {
//    console.log(d.name);
    Object.defineProperty(T, d.name, {
        get(){return new Type(d.isFn, d.dFn)}
    });
}
for (let k of Object.keys(T)) {
    Object.defineProperty(V, k, {
        get () {return new Value(new T[k]())}
    });
}
export {Type,Value,T,V}



