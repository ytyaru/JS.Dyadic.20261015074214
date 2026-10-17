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
    describe('isFn', ()=>{
    });
    describe('is', ()=>{
    });
    describe('try', ()=>{
    });
    describe('default', ()=>{
    });
});


