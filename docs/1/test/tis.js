// math.test.js
import { expect, test, describe } from "bun:test";
import { tis } from "../src/tis.js";
import { assertThrow } from "./assert-throw.js";
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
describe("tis", () => {
    describe("nun", () => {
        describe('true', () => {
            test.each([undefined,null,NaN].map(x=>[x]))('%p',v=>expect(tis.nun(v)).toBe(true));
        });
        describe('false', () => {
            test.each([false,0,'',0n,Symbol(),{},[],Map].map(x=>[x]))('%p',v=>expect(tis.nun(v)).toBe(false));
        });
    });
    describe("nul", () => {
        describe('true', () => {
            test.each([null].map(x=>[x]))('%p',v=>expect(tis.nul(v)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,NaN,false,0,'',0n,Symbol(),{},[],Map].map(x=>[x]))('%p',v=>expect(tis.nul(v)).toBe(false));
        });
    });
    describe("und", () => {
        describe('true', () => {
            test.each([undefined].map(x=>[x]))('%p',v=>expect(tis.und(v)).toBe(true));
        });
        describe('false', () => {
            test.each([null,NaN,false,0,'',0n,Symbol(),{},[],Map].map(x=>[x]))('%p',v=>expect(tis.und(v)).toBe(false));
        });
    });
    describe("nan", () => {
        describe('true', () => {
            test.each([NaN].map(x=>[x]))('%p',v=>expect(tis.nan(v)).toBe(true));
        });
        describe('false', () => {
            test.each([null,undefined,false,0,'',0n,Symbol(),{},[],Map].map(x=>[x]))('%p',v=>expect(tis.nan(v)).toBe(false));
        });
    });
    describe("bln", () => {
        describe('true', () => {
            test.each([false,true].map(x=>[x]))('%p',v=>expect(tis.bln(v)).toBe(true));
        });
        describe('false', () => {
            test.each([null,undefined,NaN,0,'',0n,Symbol(),{},[],Map].map(x=>[x]))('%p',v=>expect(tis.bln(v)).toBe(false));
        });
    });
    describe("num", () => {
        describe('true', () => {
            test.each([NaN,Infinity,-Infinity,Number.EPSILON,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,0,-1,0.1,Number()].map(x=>[x]))('%p',v=>expect(tis.num(v)).toBe(true));
        });
        describe('false', () => {
            test.each([new Number(),null,undefined,false,'','0',0n,Symbol(),{},[]].map(x=>[x]))('%p',v=>expect(tis.num(v)).toBe(false));
        });
    });
    describe("fin", () => {
        describe('true', () => {
            test.each([0.1,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,0,-1,Number()].map(x=>[x]))('%p',v=>expect(tis.fin(v)).toBe(true));
        });
        describe('false', () => {
            test.each([NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,new Number(),null,undefined,false,'','0',0n,Symbol(),{},[]].map(x=>[x]))('%p',v=>expect(tis.fin(v)).toBe(false));
        });
    });
    describe("int", () => {
        describe('true', () => {
            test.each([Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,0,-1,Number()].map(x=>[x]))('%p',v=>expect(tis.int(v)).toBe(true));
        });
        describe('false', () => {
            test.each([0.1,Number.EPSILON,NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,new Number(),null,undefined,false,'','0',0n,Symbol(),{},[]].map(x=>[x]))('%p',v=>expect(tis.int(v)).toBe(false));
        });
    });
    describe("big", () => {
        describe('true', () => {
            test.each([0n, BigInt(0), BigInt('0')].map(x=>[x]))('%p',v=>expect(tis.big(v)).toBe(true));
        });
        describe('false', () => {
            test.each([Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,0,-1,Number(),0.1,Number.EPSILON,NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,new Number(),null,undefined,false,'','0',Symbol(),{},[]].map(x=>[x]))('%p',v=>expect(tis.big(v)).toBe(false));
        });
    });
    describe("str", () => {
        describe('true', () => {
            test.each(['','0',String()].map(x=>[x]))('%p',v=>expect(tis.str(v)).toBe(true));
        });
        describe('false', () => {
            test.each([new String(),Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,0,-1,Number(),0.1,Number.EPSILON,NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,new Number(),null,undefined,false,0n,Symbol(),{},[]].map(x=>[x]))('%p',v=>expect(tis.str(v)).toBe(false));
        });
    });
    describe("sym", () => {
        describe('true', () => {
            test.each([Symbol(), Symbol.for('x')].map(x=>[x]))('%p',v=>expect(tis.sym(v)).toBe(true));
        });
        describe('false', () => {
            test.each([Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,0,-1,Number(),0.1,Number.EPSILON,NaN,Infinity,-Infinity,Number.MAX_VALUE,-Number.MAX_VALUE,new Number(),null,undefined,false,0n,'',{},[]].map(x=>[x]))('%p',v=>expect(tis.sym(v)).toBe(false));
        });
    });
    // Reference
    describe("ref", () => {
        describe('true', () => {
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),Map,C,[].map,()=>{},function(){},C.sm,C.sgm,(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.ref(v)).toBe(true));
        });
        describe('false', () => {
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.ref(v)).toBe(false));
        });
    });
    describe("obj", () => {
        describe('true', () => {
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.obj(v)).toBe(true));
        });
        describe('false', () => {
            test.each([Map,C,[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>expect(tis.obj(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.obj(v)).toBe(false));
        });
    });
    describe('ary',()=>{
        class A extends Array{}
        describe('(v)',()=>{
            describe('true',()=>{
                test.each([[],[0],[''],[0,''],new A()].map(x=>[x]))('%p',v=>{
                    expect(tis.ary(v)).toBe(true);
                });
            });
            describe('false',()=>{
                test.each([{},Object.create(null),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})()),Map,C,[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>{
                    expect(tis.ary(v)).toBe(false);
                });
            });
        });
        describe('(v,fn)',()=>{
            describe('正常系',()=>{
                describe('true',()=>{
                    test.each([[[],v=>true],[[],v=>false],[[0],tis.int],[[0,1,2],tis.int],[['0','1','2'],tis.str]])('%p',(v,fn)=>expect(tis.ary(v,fn)).toBe(true));
                });
                describe('false',()=>{
                    test.each([[[0,1,2],tis.str],[['0',0],tis.str]])('%p',(v,fn)=>expect(tis.ary(v,fn)).toBe(false));
                });
            });
            describe('異常系',()=>{
                // 第二引数にundefinedでも関数でもないものを渡す。数やコンストラクタなど。
                assertThrow(TypeError, `fn is not a function. (In 'fn(x)', 'fn' is 1)`, ()=>tis.ary([1],1));
                assertThrow(TypeError, `calling Map constructor without new is invalid`, ()=>tis.ary([1],Map));
            });
        });
    });
    describe("pob", () => {
        describe('true', () => {
            test.each([{}].map(x=>[x]))('%p',v=>expect(tis.pob(v)).toBe(true));
        });
        describe('false', () => {
            test.each([[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.pob(v)).toBe(false));
            test.each([Map,C,[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>expect(tis.pob(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.pob(v)).toBe(false));
        });
    });
    describe("nob", () => {
        describe('true', () => {
            test.each([Object.create(null)].map(x=>[x]))('%p',v=>expect(tis.nob(v)).toBe(true));
        });
        describe('false', () => {
            test.each([[],{},Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.nob(v)).toBe(false));
            test.each([Map,C,[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>expect(tis.nob(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.nob(v)).toBe(false));
        });
    });
    describe('ins',()=>{
        const MyEs5Cls = function(){};
        describe('(v)',()=>{
            describe('true',()=>{
                test.each([new Map(), new C(), new MyEs5Cls(), new Boolean(), new Number(), new String()].map(v=>[v]))('%p',v=>{
                    expect(tis.ins(v)).toBe(true);
                });
            });
            describe('false',()=>{
                test.each([{},[],Map,C,MyEs5Cls,Boolean,Number,String,()=>{},function(){},C.sm,C.sgm,Object.create(null)].map(v=>[v]))('%p',v=>{
                    expect(tis.ins(v)).toBe(false);
                });
            });
        });
        describe('(v,C)',()=>{
            describe('true',()=>{
                test.each([[new Map(),Map], [new C(),C], [new MyEs5Cls(),MyEs5Cls], [new Boolean(), Boolean], [new Number(),Number], [new String(),String]])('%p',(v,C)=>{
                    expect(tis.ins(v,C)).toBe(true);
                });
            });
            describe('false',()=>{
                test.each([[{},Object],[[],Array],[Map,Map],[C,C],[MyEs5Cls,MyEs5Cls],[Boolean,Boolean],[Number,Number],[String,String],[()=>{},Function],[function(){},Function],[C.sm,Function],[C.sgm,Function],[Object.create(null),Object]])('%p',(v,C)=>{
                    expect(tis.ins(v,C)).toBe(false);
                });
            });
            describe('例外',()=>{
                assertThrow(TypeError, 'Right hand side of instanceof is not an object', ()=>tis.ins(new C(),1))
            });
        });
    });
    describe('ins.es6',()=>{
        const MyEs5Cls = function(){};
        describe('(v)',()=>{
            describe('true',()=>{
                test.each([new C()].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.es6(v)).toBe(true);
                });
            });
            // new Map(), new MyEs5Cls(), new Boolean(), new Number(), new String()
            describe('false',()=>{
                test.each([new Map(), new MyEs5Cls(), new Boolean(), new Number(), new String()].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.es6(v)).toBe(false);
                });
                test.each([{},[],Map,C,MyEs5Cls,Boolean,Number,String,()=>{},function(){},C.sm,C.sgm,Object.create(null)].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.es6(v)).toBe(false);
                });
            });
        });
        describe('(v,C)',()=>{
            describe('true',()=>{
                test.each([[new C(),C]])('%p',(v,C)=>{
                    expect(tis.ins.es6(v,C)).toBe(true);
                });
            });
            describe('false',()=>{
                test.each([[new Map(),Map], [new MyEs5Cls(),MyEs5Cls], [new Boolean(), Boolean], [new Number(),Number], [new String(),String]])('%p',(v,C)=>{
                    expect(tis.ins.es6(v,C)).toBe(false);
                });

                test.each([[{},Object],[[],Array],[Map,Map],[C,C],[MyEs5Cls,MyEs5Cls],[Boolean,Boolean],[Number,Number],[String,String],[()=>{},Function],[function(){},Function],[C.sm,Function],[C.sgm,Function],[Object.create(null),Object]])('%p',(v,C)=>{
                    expect(tis.ins.es6(v,C)).toBe(false);
                });
            });
            describe('例外',()=>{
                assertThrow(TypeError, 'Right hand side of instanceof is not an object', ()=>tis.ins.es6(new C(),1))
            });
        });
    });
    describe('ins.es5',()=>{
        const MyEs5Cls = function(){};
        describe('(v)',()=>{
            describe('true',()=>{
                test.each([new MyEs5Cls()].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.es5(v)).toBe(true);
                });
            });
            // new Map(), new MyEs5Cls(), new Boolean(), new Number(), new String()
            describe('false',()=>{
                test.each([new C(), new Map(), new Boolean(), new Number(), new String()].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.es5(v)).toBe(false);
                });
                test.each([{},[],Map,C,MyEs5Cls,Boolean,Number,String,()=>{},function(){},C.sm,C.sgm,Object.create(null)].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.es5(v)).toBe(false);
                });
            });
        });
        describe('(v,C)',()=>{
            describe('true',()=>{
                test.each([[new MyEs5Cls(),MyEs5Cls]])('%p',(v,C)=>{
                    expect(tis.ins.es5(v,C)).toBe(true);
                });
            });
            describe('false',()=>{
                test.each([[new C(),C], [new Map(),Map], [new Boolean(), Boolean], [new Number(),Number], [new String(),String]])('%p',(v,C)=>{
                    expect(tis.ins.es5(v,C)).toBe(false);
                });

                test.each([[{},Object],[[],Array],[Map,Map],[C,C],[MyEs5Cls,MyEs5Cls],[Boolean,Boolean],[Number,Number],[String,String],[()=>{},Function],[function(){},Function],[C.sm,Function],[C.sgm,Function],[Object.create(null),Object]])('%p',(v,C)=>{
                    expect(tis.ins.es5(v,C)).toBe(false);
                });
            });
            describe('例外',()=>{
                assertThrow(TypeError, 'Right hand side of instanceof is not an object', ()=>tis.ins.es5(new C(),1))
            });
        });
    });
    describe('ins.nat',()=>{
        const MyEs5Cls = function(){};
        describe('(v)',()=>{
            describe('true',()=>{
                test.each([new Map(), new Boolean(), new Number(), new String()].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.nat(v)).toBe(true);
                });
            });
            describe('false',()=>{
                test.each([new C(), new MyEs5Cls()].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.nat(v)).toBe(false);
                });
                test.each([{},[],Map,C,MyEs5Cls,Boolean,Number,String,()=>{},function(){},C.sm,C.sgm,Object.create(null)].map(v=>[v]))('%p',v=>{
                    expect(tis.ins.nat(v)).toBe(false);
                });
            });
        });
        describe('(v,C)',()=>{
            describe('true',()=>{
                test.each([[new Map(),Map], [new Boolean(), Boolean], [new Number(),Number], [new String(),String]])('%p',(v,C)=>{
                    expect(tis.ins.nat(v,C)).toBe(true);
                });
            });
            describe('false',()=>{
                test.each([[new C(),C], [new MyEs5Cls(),MyEs5Cls]])('%p',(v,C)=>{
                    expect(tis.ins.nat(v,C)).toBe(false);
                });

                test.each([[{},Object],[[],Array],[Map,Map],[C,C],[MyEs5Cls,MyEs5Cls],[Boolean,Boolean],[Number,Number],[String,String],[()=>{},Function],[function(){},Function],[C.sm,Function],[C.sgm,Function],[Object.create(null),Object]])('%p',(v,C)=>{
                    expect(tis.ins.nat(v,C)).toBe(false);
                });
            });
            describe('例外',()=>{
                assertThrow(TypeError, 'Right hand side of instanceof is not an object', ()=>tis.ins.nat(new C(),1))
            });
        });
    });
    describe("run", () => {
        describe('true', () => {
            test.each([Map,C,[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>expect(tis.run(v)).toBe(true));
        });
        describe('false', () => {
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.run(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.run(v)).toBe(false));
        });
    });
    describe("cls", () => {
        describe('true', () => {
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.cls(v)).toBe(true));
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.cls(v)).toBe(true));
        });
        describe('false', () => {
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.cls(v)).toBe(false));
            test.each([[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>expect(tis.cls(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.cls(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.cls(v)).toBe(false));
        });
    });
    describe("cls.es6", () => {
        describe('true', () => {
            test.each([C].map(x=>[x]))('%p',v=>expect(tis.cls.es6(v)).toBe(true));
        });
        describe('false', () => {
            test.each([Map].map(x=>[x]))('%p',v=>expect(tis.cls.es6(v)).toBe(false));
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.cls.es6(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.cls.es6(v)).toBe(false));
            test.each([[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>expect(tis.cls.es6(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.cls.es6(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.cls.es6(v)).toBe(false));
        });
    });
    describe("cls.es5", () => {
        describe('true', () => {
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.cls.es5(v)).toBe(true));
        });
        describe('false', () => {
            test.each([C].map(x=>[x]))('%p',v=>expect(tis.cls.es5(v)).toBe(false));
            test.each([Map].map(x=>[x]))('%p',v=>expect(tis.cls.es5(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.cls.es5(v)).toBe(false));
            test.each([[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>expect(tis.cls.es5(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.cls.es5(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.cls.es5(v)).toBe(false));
        });
    });
    describe("cls.nat", () => {
        describe('true', () => {
            test.each([Map].map(x=>[x]))('%p',v=>expect(tis.cls.nat(v)).toBe(true));
        });
        describe('false', () => {
            test.each([C].map(x=>[x]))('%p',v=>expect(tis.cls.nat(v)).toBe(false));
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.cls.nat(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.cls.nat(v)).toBe(false));
            test.each([[].map,()=>{},function(){},C.sm,C.sgm].map(x=>[x]))('%p',v=>expect(tis.cls.nat(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.cls.nat(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.cls.nat(v)).toBe(false));
        });
    });
    describe("fn", () => {
        describe('true', () => {
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.fn(v)).toBe(true));
            test.each([[].map,()=>{},async()=>{},function(){},(function(){}).bind(null),C.sm,C.sgm,C.sam,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn(v)).toBe(true));
        });
        describe('false', () => {
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.fn(v)).toBe(false));
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.fn(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.fn(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.fn(v)).toBe(false));
        });
    });
    describe("fn.s", () => {
        describe('true', () => {
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.fn.s(v)).toBe(true));
//            test.each([[].map,()=>{},async()=>{},function(){},(function(){}).bind(null),C.sm,C.sgm,C.sam,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.s(v)).toBe(true));
            test.each([[].map,(function(){}).bind(null),()=>{},function(){},C.sm].map(x=>[x]))('%p',v=>expect(tis.fn.s(v)).toBe(true));
        });
        describe('false', () => {
            test.each([async()=>{},C.sgm,C.sam,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.s(v)).toBe(false));
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.fn.s(v)).toBe(false));
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.fn.s(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.fn.s(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.fn.s(v)).toBe(false));
        });
    });
    describe("fn.g", () => {
        describe('true', () => {
            test.each([C.sgm].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(true));
        });
        describe('false', () => {
            test.each([C.sam,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(false));
            test.each([[].map,(function(){}).bind(null),()=>{},function(){},C.sm].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(false));
            //test.each([async()=>{},C.sgm,C.sam,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(false));
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(false));
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.fn.g(v)).toBe(false));
        });
    });
    describe("fn.a", () => {
        describe('true', () => {
            test.each([C.sam].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(true));
        });
        describe('false', () => {
            test.each([C.sgm,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(false));
            test.each([[].map,(function(){}).bind(null),()=>{},function(){},C.sm].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(false));
            //test.each([async()=>{},C.sgm,C.sam,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(false));
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(false));
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.fn.a(v)).toBe(false));
        });
    });
    describe("fn.ag", () => {
        describe('true', () => {
            test.each([C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(true));
        });
        describe('false', () => {
            test.each([C.sam,C.sgm].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(false));
            test.each([[].map,(function(){}).bind(null),()=>{},function(){},C.sm].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(false));
            //test.each([async()=>{},C.sgm,C.sam,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(false));
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(false));
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.fn.ag(v)).toBe(false));
        });
    });
    describe("fn.nat", () => {
        describe('true', () => {
            test.each([[].map,(function(){}).bind(null)].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(true));
        });
        describe('false', () => {
            test.each([C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            test.each([C.sam,C.sgm].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            test.each([function(){},C.sm].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            //test.each([[].map,(function(){}).bind(null),()=>{},function(){},C.sm].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            //test.each([async()=>{},C.sgm,C.sam,C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.fn.nat(v)).toBe(false));
        });
    });
    describe("fn.nat.b", () => {
        describe('true', () => {
            test.each([(function(){}).bind(null)].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(true));
        });
        describe('false', () => {
            test.each([[].map].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
            test.each([C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
            test.each([C.sam,C.sgm].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
            test.each([function(){},C.sm].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.fn.nat.b(v)).toBe(false));
        });
    });
    describe("fn.nat.nb", () => {
        describe('true', () => {
            test.each([[].map].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(true));
        });
        describe('false', () => {
            test.each([(function(){}).bind(null)].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
            test.each([C.sagm].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
            test.each([C.sam,C.sgm].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
            test.each([function(){},function fN(){},function fn(){}].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
            test.each([function(){},C.sm].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
            // functionでも名前の先頭が大文字ならクラスと判定する
            test.each([function Fn(){},function FN(){}].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
            test.each([Map,C].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
            test.each([{},[],Object.create(null),Object.create({}),new Boolean(),new Number(),new String(),new Map(),new C(),(new (function(){})())].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
            test.each([null,undefined,NaN,0,-1,0.1,Infinity,-Infinity,Number.EPSILON,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.MAX_VALUE,-Number.MAX_VALUE,Number(),false,0n,'',Symbol()].map(x=>[x]))('%p',v=>expect(tis.fn.nat.nb(v)).toBe(false));
        });
    });
});

