import { describe, test, expect } from "bun:test";
import { tis } from "../src/tis.js";
import { Type, Value, T, V } from "../src/type.js";
import { assertThrow } from "./assert-throw.js";
describe('Type', ()=>{
    describe('class', ()=>{
        test('defined', ()=>expect(Type).toBeDefined());
    });
    describe('constructor', ()=>{
        describe('正常系', ()=>{
            test('(isFn,dFn)', ()=>expect(new Type(v=>true,d=>0)).toBeInstanceOf(Type));
        });
        describe('異常系', ()=>{
            test('(isFn,dFn)', ()=>assertThrow(TypeError, 'dFn は真偽値を返す関数であるべきです。:null', ()=>new Type(v=>true,null)));
            test('(isFn,dFn)', ()=>assertThrow(TypeError, 'isFn は真偽値を返す関数であるべきです。:null', ()=>new Type(null,_=>0)));
            test('(isFn,dFn)', ()=>assertThrow(TypeError, 'isFn は真偽値を返す関数であるべきです。:null', ()=>new Type(null,null)));
        });
    });
    describe('getter', ()=>{
        test('isFn, default', ()=>{
            const isFn = v=>true;
            const D = 0;
            const dFn = _=>D;
            const t = new Type(isFn,dFn);
            expect(t).toBeInstanceOf(Type);
            expect(t.isFn).toBe(isFn);
            expect(t.default).toBe(D);
        });
    });
    describe('method', ()=>{
        const isFn = v=>'string'===typeof v && 0 < v.length;
        const D = 'default string.';
        const dFn = _=>D;
        const t = new Type(isFn,dFn);
        describe('is', ()=>{
            describe('正常系', ()=>{
                test.each(['a','ab'].map(x=>[x]))('%p', v=>expect(t.is(v)).toBe(true));
            });
            describe('異常系', ()=>{
                test.each(['',0,null].map(x=>[x]))('%p', v=>expect(t.is(v)).toBe(false));
            });
        });
        describe('try', ()=>{
            describe('正常系', ()=>{
                test.each(['a','ab'].map(x=>[x]))('%p', v=>expect(t.try(v)).toBe(v));
            });
            describe('異常系', ()=>{
                test.each(['',0,null].map(x=>[x]))('%p', v=>assertThrow(TypeError,/^vはisFnが真を返す値であるべきです。v:/,_=>t.try(v)));
            });
        });
    });
});
describe('Value', ()=>{
    describe('class', ()=>{
        test('defined', ()=>expect(Value).toBeDefined());
    });
    describe('constructor', ()=>{
        describe('正常系', ()=>{
            test('(type,onSet)', ()=>expect(new Value(new Type(_=>true,_=>0),_=>0)).toBeInstanceOf(Value));
        });
        describe('異常系', ()=>{
            test('(type,onSet)', ()=>assertThrow(TypeError, 'onSet は真偽値を返す関数であるべきです。:null', ()=>new Value(new Type(_=>true,_=>0),null)));
            test('(type,onSet)', ()=>assertThrow(TypeError, 'type はType型インスタンスであるべきです。:null', ()=>new Value(null,_=>0)));
            test('(type,onSet)', ()=>assertThrow(TypeError, 'type はType型インスタンスであるべきです。:null', ()=>new Value(null,null)));
        });
    });
    describe('getter/setter', ()=>{
        test('type, onSet, v', ()=>{
            const isFn = v=>'string'===typeof v && 0 < v.length;
            const D = 'default string.';
            const dFn = _=>D;
            const t = new Type(isFn,dFn);
            const onSet = _ => 0;
            const v = new Value(t,onSet);
            expect(v).toBeInstanceOf(Value);
            expect(v.type).toBe(t);
            expect(v.onSet).toBe(onSet);
            expect(v.v).toBe(D);
            v.v = 'a';
            expect(v.v).toBe('a');
        });
    });
    describe('setter v', ()=>{
        const isFn = v=>'string'===typeof v && 0 < v.length;
        const D = 'default string.';
        const dFn = _=>D;
        const t = new Type(isFn,dFn);
        const onSet = _ => 0;
        //const v = new Value(t,onSet);
        describe('throw', ()=>{
            const v = new Value(t);
            //test.each(['',0,null].map(x=>[x]))('%p', v=>assertThrow(TypeError, /^vはisFnが真を返す値であるべきです。v:/, _=>v.v=v));
            test.each(['',0,null].map(x=>[x]))('%p', x=>assertThrow(TypeError, /^vはisFnが真を返す値であるべきです。v:/, _=>v.v=x));
        });
        describe('ignore', ()=>{
            const v = new Value(t, Value.onSets.ignore);
            test.each(['',0,null].map(x=>[x]))('%p', x=>{v.v='a'; v.v=x; expect(v.v).toBe('a')});
        });
        describe('default', ()=>{
            const v = new Value(t, Value.onSets.default);
            test.each(['',0,null].map(x=>[x]))('%p', x=>{v.v='a'; v.v=x; expect(v.v).toBe(D)});
        });
    });
});

describe('T', ()=>{
    describe('has API', ()=>{
        const isGetter = n => {
            const des = Object.getOwnPropertyDescriptor(T, n);
            const isG = typeof des?.get === 'function';
            console.log(des);
            expect(isG).toBe(true);
        }
        test.each(Object.keys(tis).map(x=>[x]))('%s', n=>isGetter(n));
        test.each(Object.keys(tis).filter(n=>!['nun','nul'].some(x=>x===n)).map(x=>[x+'N']))('%s', n=>isGetter(n));
    });
});
console.log('------------------------------------');
console.log(T);


