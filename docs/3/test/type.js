import { describe, test, expect } from "bun:test";
import { Type, Value, T, V } from "../src/type.js";
describe('Type', ()=>{
    describe('class', ()=>{
        test('defined', ()=>expect(Type).toBeDefined());
    });
    describe('constructor', ()=>{
        describe('正常系', ()=>{
            test('(isFn,dFn)', ()=>expect(new Type(v=>true,d=>0)).toBeInstanceOf(Type));
        });
        describe('異常系', ()=>{
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


