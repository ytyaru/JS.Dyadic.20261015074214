// math.test.js
import { expect, test, describe } from "bun:test";
import { assertThrow } from "./assert-throw.js";
import { tis } from "../src/tis.js";
import { tow } from "../src/tow.js";
class C {
    static sm() {}
    static *sgm(){yield 0}
    static async sam() {}
    static async *sagm() {yield 0}
    m() {}
    *gm(){yield 0}
    async am() {}
    async *agm() {yield 0}
}
describe("tow", () => {
    describe('nun', () => {
        describe('true', () => {
            test.each([undefined,null,NaN].map(x=>[x]))('%p',v=>expect(tow.nun(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([false,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nun(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nun(v)));
        });
    });

    test("und", () => {
        expect(tow.und(undefined)).toBe(true);
        assertThrow(TypeError, /^Type mismatch /, ()=>tow.und(null));
    });
    describe('und', () => {
        describe('true', () => {
            test.each([undefined].map(x=>[x]))('%p',v=>expect(tow.und(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([null,NaN,false,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.und(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.und(v)));
        });
    });
    describe('nul', () => {
        describe('true', () => {
            test.each([null].map(x=>[x]))('%p',v=>expect(tow.nul(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([undefined,NaN,false,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nul(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nul(v)));
        });
    });
    describe('nan', () => {
        describe('true', () => {
            test.each([NaN].map(x=>[x]))('%p',v=>expect(tow.nan(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([undefined,null,false,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nan(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nan(v)));
        });
    });
    describe('bln', () => {
        describe('true', () => {
            test.each([false,true,Boolean()].map(x=>[x]))('%p',v=>expect(tow.bln(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([undefined,null,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,0n,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.bln(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.bln(v)));
        });
    });
    describe('num', () => {
        describe('true', () => {
            test.each([NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number()].map(x=>[x]))('%p',v=>expect(tow.num(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([false,true,Boolean(),undefined,null,0n,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.num(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.num(v)));
        });
    });
    describe('fin', () => {
        describe('true', () => {
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number()].map(x=>[x]))('%p',v=>expect(tow.fin(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fin(v)));
            test.each([false,true,Boolean(),undefined,null,0n,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fin(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fin(v)));
        });
    });
    describe('int', () => {
        describe('true', () => {
            test.each([0,-1,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number()].map(x=>[x]))('%p',v=>expect(tow.int(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([0.1,Number.EPSILON,NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.int(v)));
            test.each([false,true,Boolean(),undefined,null,0n,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.int(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.int(v)));
        });
    });
    describe('big', () => {
        describe('true', () => {
            test.each([0n].map(x=>[x]))('%p',v=>expect(tow.big(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.big(v)));
            test.each([false,true,Boolean(),undefined,null,'',Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.big(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.big(v)));
        });
    });
    describe('str', () => {
        describe('true', () => {
            test.each(['','a','0','あ',String()].map(x=>[x]))('%p',v=>expect(tow.str(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.str(v)));
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.str(v)));
            test.each([false,true,Boolean(),undefined,null,0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.str(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.str(v)));
        });
    });
    describe('sym', () => {
        describe('true', () => {
            test.each([Symbol(),Symbol.for('x')].map(x=>[x]))('%p',v=>expect(tow.sym(v)).toBe(true))
        });
        describe('throw', () => {
            test.each([/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.sym(v)));
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.sym(v)));
            test.each([false,true,Boolean(),undefined,null,'',0n].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.sym(v)));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.sym(v)));
        });
    });
    describe('ref', () => {
        describe('true', () => {
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map,/^/,new RegExp('^')].map(x=>[x]))('%p',v=>expect(tow.ref(v)).toBe(true));
        });
        describe('throw', () => {
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ref(v)));
            test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ref(v)));
        });
    });
    describe('obj', () => {
        describe('true', () => {
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>expect(tow.obj(v)).toBe(true));
        });
        describe('throw', () => {
            test.each([Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.obj(v)));
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.obj(v)));
            test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.obj(v)));
        });
    });
    describe('ary', () => {
        class A extends Array{}
        describe('(v)', () => {
            describe('true', () => {
                test.each([[],new A(),[0,'']].map(x=>[x]))('%p',v=>expect(tow.ary(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([{},Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v)));
                test.each([Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v)));
            });
        });
        describe('(v,fn)', () => {
            describe('true', () => {
                test.each([[],[0],[0,-1]].map(x=>[x]))('%p',v=>expect(tow.ary(v,tis.int)).toBe(true));
                test.each([[],[''],['0','-1']].map(x=>[x]))('%p',v=>expect(tow.ary(v,tis.str)).toBe(true));
            });
            describe('throw', () => {
                test.each([[0],[0,-1],[0,'']].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v, tis.str)));
                test.each([{},Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v)));
                test.each([Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ary(v)));
            });
        });
    });
    describe('pob', () => {
        describe('true', () => {
            test.each([{}].map(x=>[x]))('%p',v=>expect(tow.pob(v)).toBe(true));
        });
        describe('throw', () => {
            test.each([[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^'),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.pob(v)));
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.pob(v)));
            test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.pob(v)));
        });
    });
    describe('nob', () => {
        describe('true', () => {
            test.each([Object.create(null)].map(x=>[x]))('%p',v=>expect(tow.nob(v)).toBe(true));
        });
        describe('throw', () => {
            test.each([{},[],Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^'),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nob(v)));
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nob(v)));
            test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.nob(v)));
        });
    });
    describe('ins', () => {
        describe('(v)', () => {
            describe('true', () => {
                test.each([new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^'),].map(x=>[x]))('%p',v=>expect(tow.ins(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([{},[],Object.create(null),Object.create({}),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins(v)));
            });
        });
        describe('(v,C)', () => {
            describe('true', () => {
                test.each([new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^'),].map(x=>[x]))('%p',v=>expect(tow.ins(v,v.constructor)).toBe(true));
            });
            describe('throw', () => {
                test.each([{},[],Object.create(null),Object.create({}),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins(v,v.constructor)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins(v,v.constructor)));
                //test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins(v,v.constructor)));
                test.each([false,true,Boolean(),'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins(v,v.constructor)));
                test.each([undefined,null].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins(v,v)));
            });
        });
        describe('es6', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each([new C()].map(x=>[x]))('%p',v=>expect(tow.ins.es6(v)).toBe(true));
                });
                describe('throw', () => {
                    test.each([new Boolean(),new Number(),new String(),new Map(),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v)));
                    test.each([(new (function(){})()),(new (function Fn(){})())].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v)));
                    test.each([{},[],Object.create(null),Object.create({}),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v)));
                    test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v)));
                });
            });
            describe('(v,C)', () => {
                describe('true', () => {
                    test.each([new C()].map(x=>[x]))('%p',v=>expect(tow.ins.es6(v,v.constructor)).toBe(true));
                });
                describe('throw', () => {
                    test.each([new Boolean(),new Number(),new String(),new Map(),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v,v.constructor)));
                    test.each([(new (function(){})())].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v,v.constructor)));
                    test.each([{},[],Object.create(null),Object.create({}),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v,v.constructor)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v,v.constructor)));
                    //test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v,v.constructor)));
                    test.each([false,true,Boolean(),'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v,v.constructor)));
                    test.each([undefined,null].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es6(v,v)));
                });
            });
        });
        describe('es5', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each([(new (function Fn(){})()), (new (function FN(){})())].map(x=>[x]))('%p',v=>expect(tow.ins.es5(v)).toBe(true));
                });
                describe('throw', () => {
                    test.each([new C()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v)));
                    test.each([new Boolean(),new Number(),new String(),new Map(),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v)));
                    test.each([(new (function(){})()),(new (function fn(){})()),(new (function fN(){})())].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v)));

                    test.each([{},[],Object.create(null),Object.create({}),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v)));
                    test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v)));
                });
            });
            describe('(v,C)', () => {
                describe('true', () => {
                    test.each([(new (function Fn(){})()),(new (function FN(){})())].map(x=>[x]))('%p',v=>expect(tow.ins.es5(v,v.constructor)).toBe(true));
                });
                describe('throw', () => {
                    test.each([(new (function(){})()),(new (function fn(){})()),(new (function fN(){})())].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v,v.constructor)));
                    test.each([new C()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v,v.constructor)));
                    test.each([new Boolean(),new Number(),new String(),new Map(),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v,v.constructor)));
                    test.each([{},[],Object.create(null),Object.create({}),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v,v.constructor)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v,v.constructor)));
                    test.each([false,true,Boolean(),'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v,v.constructor)));
                    test.each([undefined,null].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.es5(v,v)));
                });
            });
        });
        describe('nat', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each([new Boolean(),new Number(),new String(),new Map(),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>expect(tow.ins.nat(v)).toBe(true));
                });
                describe('throw', () => {
                    test.each([new C()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v)));
                    test.each([(new (function Fn(){})()), (new (function FN(){})())].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v)));
                    test.each([(new (function(){})()),(new (function fn(){})()),(new (function fN(){})())].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v)));

                    test.each([{},[],Object.create(null),Object.create({}),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v)));
                    test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v)));
                });
            });
            describe('(v,C)', () => {
                describe('true', () => {
                    test.each([new Boolean(),new Number(),new String(),new Map(),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>expect(tow.ins.nat(v,v.constructor)).toBe(true));
                });
                describe('throw', () => {
                    test.each([new C()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v,v.constructor)));
                    test.each([(new (function Fn(){})()),(new (function FN(){})())].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v,v.constructor)));
                    test.each([(new (function(){})()),(new (function fn(){})()),(new (function fN(){})())].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v,v.constructor)));
                    test.each([{},[],Object.create(null),Object.create({}),Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v,v.constructor)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v,v.constructor)));
                    test.each([false,true,Boolean(),'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v,v.constructor)));
                    test.each([undefined,null].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.ins.nat(v,v)));
                });
            });
        });
    });
    describe('run', () => {
        describe('true', () => {
            test.each([Map,C,function Fn(){},function FN(){},function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map].map(x=>[x]))('%p',v=>expect(tow.run(v)).toBe(true));
        });
        describe('throw', () => {
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.run(v)));
            test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.run(v)));
            test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.run(v)));
        });
    });
    describe('cls', () => {
        describe('(v)', () => {
            describe('true', () => {
                test.each([Map,C,function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tow.cls(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map,()=>{},async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls(v)));
            });
        });
        describe('es6', () => {
            describe('true', () => {
                test.each([C].map(x=>[x]))('%p',v=>expect(tow.cls.es6(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([Map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es6(v)));
                test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es6(v)));
                test.each([function(){},function(){},function fN(){},function fn(){},C.sm,C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map,()=>{},async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es6(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es6(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es6(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es6(v)));
            });
        });
        describe('es5', () => {
            describe('true', () => {
                test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tow.cls.es5(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([C].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es5(v)));
                test.each([Map].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es5(v)));
                test.each([function(){},function(){},function fN(){},function fn(){},C.sm,C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map,()=>{},async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es5(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es5(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es5(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.es5(v)));
            });
        });
        describe('nat', () => {
            describe('true', () => {
                test.each([Map].map(x=>[x]))('%p',v=>expect(tow.cls.nat(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([C].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.nat(v)));
                test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.nat(v)));
                test.each([function(){},function(){},function fN(){},function fn(){},C.sm,C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map,()=>{},async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.nat(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.nat(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.nat(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.cls.nat(v)));
            });
        });
    });
    describe('fn', () => {
        describe('(v)', () => {
            describe('true', () => {
                test.each([function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,(function(){}).bind(null),[].map,()=>{},async()=>{}].map(x=>[x]))('%p',v=>expect(tow.fn(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([Map,C,function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn(v)));
            });
        });
        describe('nat', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each([[].map,(function(){}).bind(null)].map(x=>[x]))('%p',v=>expect(tow.fn.nat(v)).toBe(true));
                });
                describe('throw', () => {
                    test.each([function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,()=>{},async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat(v)));
                    test.each([Map,C,function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat(v)));
                    test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat(v)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat(v)));
                    test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat(v)));
                });

            });
            describe('b', () => {
                describe('true', () => {
                    test.each([(function(){}).bind(null)].map(x=>[x]))('%p',v=>expect(tow.fn.nat.b(v)).toBe(true));
                });
                describe('throw', () => {
                    test.each([function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,[].map,()=>{},async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.b(v)));
                    test.each([Map,C,function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.b(v)));
                    test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.b(v)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.b(v)));
                    test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.b(v)));
                });
            });
            describe('nb', () => {
                describe('true', () => {
                    test.each([[].map].map(x=>[x]))('%p',v=>expect(tow.fn.nat.nb(v)).toBe(true));
                });
                describe('throw', () => {
                    test.each([(function(){}).bind(null)].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.nb(v)));
                    test.each([function(){},C.sm,function(){},function fN(){},function fn(){},C.sam,C.sgm,C.sagm,()=>{},async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.nb(v)));
                    test.each([Map,C,function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.nb(v)));
                    test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.nb(v)));
                    test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.nb(v)));
                    test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.nat.nb(v)));
                });
            });
        });
        describe('s', () => {
            describe('true', () => {
                test.each([function(){},C.sm,function(){},function fN(){},function fn(){},(function(){}).bind(null),[].map,()=>{}].map(x=>[x]))('%p',v=>expect(tow.fn.s(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([C.sam,C.sgm,C.sagm,async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.s(v)));
                test.each([async function(){}, function*(){}, async function*(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.s(v)));
                // 命名規則によりES5クラスと判定する
                test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.s(v)));
                test.each([Map,C].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.s(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.s(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.s(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.s(v)));
            });
        });
        describe('g', () => {
            describe('true', () => {
                test.each([C.sgm,function*(){}].map(x=>[x]))('%p',v=>expect(tow.fn.g(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([function(){},C.sm,function(){},function fN(){},function fn(){},(function(){}).bind(null),[].map,()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.g(v)));
                test.each([C.sam,C.sagm,async()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.g(v)));
                test.each([async function(){}, async function*(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.g(v)));
                // 命名規則によりES5クラスと判定する
                test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.g(v)));
                test.each([Map,C].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.g(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.g(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.g(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.g(v)));
            });
        });
        describe('a', () => {
            describe('true', () => {
                test.each([C.sam,async()=>{},async function(){}].map(x=>[x]))('%p',v=>expect(tow.fn.a(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([C.sm,function(){},function(){},function fN(){},function fn(){},(function(){}).bind(null),[].map,()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.a(v)));
                test.each([C.sagm,async function*(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.a(v)));
                test.each([C.sgm,function*(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.a(v)));
                // 命名規則によりES5クラスと判定する
                test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.a(v)));
                test.each([Map,C].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.a(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.a(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.a(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.a(v)));
            });
        });
        describe('ag', () => {
            describe('true', () => {
                test.each([C.sagm,async function*(){}].map(x=>[x]))('%p',v=>expect(tow.fn.ag(v)).toBe(true));
            });
            describe('throw', () => {
                test.each([C.sm,function(){},function(){},function fN(){},function fn(){},(function(){}).bind(null),[].map,()=>{}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.ag(v)));
                test.each([C.sam,async()=>{},async function(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.ag(v)));
                test.each([C.sgm,function*(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.ag(v)));
                // 命名規則によりES5クラスと判定する
                test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.ag(v)));
                test.each([Map,C].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.ag(v)));
                test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),/^/,new RegExp('^')].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.ag(v)));
                test.each([0,-1,0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number(),NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.ag(v)));
                test.each([false,true,Boolean(),undefined,null,'',0n,Symbol()].map(x=>[x]))('%p',v=>assertThrow(TypeError, /^Type mismatch /, ()=>tow.fn.ag(v)));
            });
        });
    });
});

