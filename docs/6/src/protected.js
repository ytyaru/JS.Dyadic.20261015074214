/*
class A {
    #v;
    constructor() {
        protected.i.add(this, A, {
            set v: (x)=>this.#v=x,
            insPropA: 0,
            insMethA: x=>console.log(x),
        })
    }
    get v() {return this.#v}
    set v(x) {
        // protectedでは実行したくない処理 start
        if ('number'!==typeof x) {throw new TypeError(``)}
        // protectedでは実行したくない処理 end
        this[protected.i.get.self(this)].v = x;
    }
}
protected.s.add(A, {
    set v: (x)=>A.staPropA = `static property value: ${x}`
    staPropA: 'static property value',
    staMethA: x=>console.log('static method A: ', x),
});
class B extends A {
    static meth(x) {this[protected.s.super.get(this)].staMethA(x)}
    constructor() {
        super()
    }
    set v(x) {
        // protectedでは実行したくない処理 start
        if (!Number.isSafeInteger(x)) {throw new TypeError(``)}
        // protectedでは実行したくない処理 end
        this[protected.i.get.super(this)].v = x;
    }
}
class C extends B {
    constructor() {
        super()
    }
    set v(x) {
        // protectedでは実行したくない処理 start
        if ('string'!==typeof x) {throw new TypeError(``)}
        // protectedでは実行したくない処理 end
        this[protected.i.get.super(this)].v = x;
    }
}
// ----------------------------------------

class A {
    #v;
    constructor() {
        protected.i.add(this, A, {
            set v: (x)=>this.#v=x,
            insPropA: 0,
            insMethA: x=>console.log(x),
        })
    }
    get v() {return this.#v}
    set v(x) {
        // protectedでは実行したくない処理 start
        if ('number'!==typeof x) {throw new TypeError(``)}
        // protectedでは実行したくない処理 end
        protected.i.get.self(this).v = x;
    }
}
class B extends A {
    static meth(x) {protected.s.super.get(this).staMethA(x)}
    constructor() {
        super()
    }
    set v(x) {
        // protectedでは実行したくない処理 start
        if (!Number.isSafeInteger(x)) {throw new TypeError(``)}
        // protectedでは実行したくない処理 end
        protected.i.get.super(this).v = x;
    }
}
*/
