import { describe, test, expect } from "bun:test";
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


