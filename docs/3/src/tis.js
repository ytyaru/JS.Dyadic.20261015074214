const isObj = v=>null!==v && 'object'===typeof v;
const isRun = v=>'function'===typeof v;
const fnNms = Object.freeze({
    's':'',
    'a':'Async',
    'g':'Generator',
    'ag':'AsyncGenerator'
});
const getFnNm = f => fnNms[f] ?? (() => { throw new TypeError(`Invalid f. Valid keys: ${Object.keys(fnNms)}`); })();
const isFnType = (v,f)=>isRun(v) && (f ? v.constructor.name === `${getFnNm(f)}Function` : true);
const isNum = v=>'number'===typeof v;
const isCls = v => {
    if (!isRun(v)) return false;
    if (isFnType(v,'s')) return /^[A-Z]/.test(v.name); // functionなら先頭一字目が大文字ならクラスと判定
    try { // 中身を実行させないために、ダミーのProxyを挟んでnewを試みる
        const TargetProxy = new Proxy(v, { construct() { return {}; } });
        new TargetProxy();
        return true;
    // Arrow functionやメソッド、ビルトインの一部(parseIntなど)はここでエラーになる
    } catch (err) {return false;}
}
const isFn = v => isRun(v) && !isCls(v);
// isFn.s|g|a|ag(v) メソッド作成
Object.keys(fnNms).map(n=>isFn[n]=v=>isFnType(v,n) && !isCls(v));
const isNatCode = s => /\[native code\]/.test(s);
isFn.nat = v => isFn(v) && isNatCode(getCode(v));
const isBnd = v => v.name.startsWith('bound ') && !v.hasOwnProperty('prototype');
isFn.nat.b  = v => isFn.nat(v) &&  isBnd(v); // bound
isFn.nat.nb = v => isFn.nat(v) && !isBnd(v); // not bound
const getCode = v => isRun(v) ? Function.prototype.toString.call(v)
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '').trim() // コメント削除
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""') // 文字列リテラル（'' , "" , ``）を空文字に置換
    .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//') : ''; // 正規表現リテラルを除外
const isEs6ClsCode = s => /^\s*class\b/.test(s); 
isCls.es6 = v => isEs6ClsCode(getCode(v)); 
isCls.nat = v => isCls(v) && /\[native code\]/.test(getCode(v)); // isCls(v)がないとNative関数との区別不能になる
const isEs5ClsCode = s => !(isEs6ClsCode(s) || isNatCode(s));
isCls.es5 = v => isCls(v) && isEs5ClsCode(getCode(v));
export const tis = {
    nun: v=>'und nul nan'.split(' ').some(n=>tis[n](v)),
    und: v=>undefined===v,
    nul: v=>null===v,
    nan: v=>Number.isNaN(v),

    bln: v=>'boolean'===typeof v,
    num: isNum,
    fin: v=>Number.isFinite(v) && (v<=Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER<=v),
    int: v=>Number.isSafeInteger(v),
    big: v=>'bigint'===typeof v,
    str: v=>'string'===typeof v,
    sym: v=>'symbol'===typeof v,

    ref: v=>isObj(v) || isRun(v),
    obj: isObj,
    ary: (v,fn)=>Array.isArray(v) && (fn ? v.every(x=>fn(x)) : true),
    pob: v=>isObj(v) && Object.prototype===Object.getPrototypeOf(v), // Plain Object
    nob: v=>isObj(v) && null===Object.getPrototypeOf(v),             // None Prototype Object
    ins: (v,C)=>{
        if (!isObj(v) || Array.isArray(v)) return false;
        const proto = Object.getPrototypeOf(v);
        if (proto === null || proto === Object.prototype) return false;
        const ctor = proto.constructor;
        return isRun(ctor) && ctor.prototype === proto && (C ? v instanceof C : true);
    },
    run: isRun,
    cls: isCls,
    fn: isFn,
};
// tis.ins.es6|es5|nat 作成
'es6 es5 nat'.split(' ').map(n=>tis.ins[n]=(v,C)=>tis.ins(v,C) && tis.cls[n](v?.constructor));

