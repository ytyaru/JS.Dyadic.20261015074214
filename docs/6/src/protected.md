bun js。クラスのProtected用名前空間オブジェクトを生成したい。

```javascript
const protectedSymbolMap = new WeakMap();
const registBaseClass = baseCls => {
    if ('function'!==typeof baseCls) {throw new TypeError(`baseClsはクラスであるべきです。`)}
    if (protectedSymbolMap.has(baseCls)) {return protectedSymbolMap.get(baseCls)}
    const s = Symbol();
    protectedSymbolMap.set(baseCls, s);
    return s;
}
const getProtectedSymbol = cls => {
    if ('function'!==typeof cls) {throw new TypeError(`clsはクラスであるべきです。`)}
    const s = protectedSymbolMap.get(cls);
    if (!s) {protectedSymbolMap.set(cls, Symbol())}
    const S = (cls === Value || Value.isPrototypeOf(cls))
    return s ? s : protectedSymbolMap.get(cls);
}

class Protected {
    static #map = new Map();
    static set(cls) {
        if ('function'!==typeof baseCls) {throw new TypeError(`baseClsはクラスであるべきです。`)}
        if (this.#map.has(baseCls)) {return this.#map.get(baseCls)}
        const s = Symbol();
        this.#map.set(baseCls, s);
        return s;
    }
    static get(cls) {
        if ('function'!==typeof cls) {throw new TypeError(`clsはクラスであるべきです。`)}
        for(let [B,S] of this.#map) {
            if (cls === B || Value.isPrototypeOf(B)) {return S}
        }
        throw new ReferenceError(`clsは登録済み基底クラスまたはその継承クラスではありません。cls:${cls}, Map:${this.#map.keys()}`);
    }
}
```
```
class A {
    #a;
    constructor() {this.#a=0;}
    set [Protected.get(A)](x) {this.#a = x;}
}
Protected.set(A);
class B extends A {
    init() {this[Protected.set(this.constructor)]}
}
```

クラス定義とProtectedのSymbol取得の順序が自己参照して成立しない・・・。

では、Protected型としてextendsさせるようにするか？

```
class Protected {
    static #map = new Map();
//    constructor(self) {Protected.set(self.constructor);} // selfはインスタンスであること
    constructor(cls) {Protected.set(cls);} // selfはインスタンスであること
    static set(cls) {
        if ('function'!==typeof baseCls) {throw new TypeError(`baseClsはクラスであるべきです。`)}
        if (this.#map.has(baseCls)) {return this.#map.get(baseCls)}
        const s = Symbol();
        this.#map.set(baseCls, s);
        return s;
    }
    static get(cls) {
        if ('function'!==typeof cls) {throw new TypeError(`clsはクラスであるべきです。`)}
        for(let [B,S] of this.#map) {
            if (cls === B || Value.isPrototypeOf(B)) {return S}
        }
        throw new ReferenceError(`clsは登録済み基底クラスまたはその継承クラスではありません。cls:${cls}, Map:${this.#map.keys()}`);
    }
}
```
```
class A extends Protected {
    #a;
    constructor() {super(A); this.#a=0;}
    set [Protected.get(A)](x) {this.#a = x;}
}
Protected.set(A);
class B extends A {
    init() {this[Protected.get(this.constructor)]}
}
```

いや登録するのはクラスとAPI名の二つセットでないとダメでは？

```
class Protected {
    static #map = new Map();
    static set(cls, name) {
        if ('function'!==typeof cls) {throw new TypeError(`clsはクラスであるべきです。`)}
        if ('string'!==typeof name) {throw new TypeError(`nameは文字列であるべきです。`)}
        if (this.#map.has(cls)) {
            if (this.#map.has(name)) {return this.#map.get(cls).get(name)}
            this.#map.set(cls, new Map([[name, Symbol()]]));
            return this.#map.get(cls)
        }
        this.#map.get(cls).set(Symbol());
        return this.#map.get(cls).get(name)
    }
    static get(cls) {
        if ('function'!==typeof cls) {throw new TypeError(`clsはクラスであるべきです。`)}
        for(let [B,S] of this.#map) {
            if (cls === B || Value.isPrototypeOf(B)) {return S}
        }
        throw new ReferenceError(`clsは登録済み基底クラスまたはその継承クラスではありません。cls:${cls}, Map:${this.#map.keys()}`);
    }
}
```

```javascript
class Protected {
    static #map = new Map();
    static tryCls(v,n='B') {if ('function'!==typeof v) {throw new TypeError(`${n} はクラスであるべきです。:${v}`)}}
    static tryStr(v,n='name') {if ('string'!==typeof v) {throw new TypeError(`${n} は文字列であるべきです。:${v}`)}}
    static set(B, name) {
        this.tryCls(B);
        this.tryStr(name);
        if (this.#map.has(B)) {
            if (this.#map.has(name)) {return this.#map.get(B).get(name)}
            this.#map.set(B, new Map([[name, Symbol()]]));
            return this.#map.get(B)
        }
        this.#map.get(B).set(Symbol());
        return this.#map.get(B).get(name)
    }
    static names(C) {
        for(let B of this.#map.keys()) {
            if ((B === C || B.isPrototypeOf(C)))) {return this.#map.get(B).keys()}
        }
    }
    static get(C, name) {
        this.tryCls(C,'C');
        this.tryStr(name);
        for(let [B,S] of this.#map) {
            if ((B === C || B.isPrototypeOf(C)) && this.#map.get(B).has(name)) {return S}
        }
        throw new ReferenceError(`Cは登録済み基底クラスまたはその継承クラスではありません。あるいはクラスが登録済みでも指定されたプロパティ名が未登録です。C:${C}, name:${name}, Map:${this.#map.keys()}, names:${this.names(C)}`);
    }
}
```
```
class A {
    static { Protected.set(this.constructor, 'v'); }
    // Private
    #v;
    constructor() {
    }
    // Protected
    set [Protected.get(this.constructor, 'v')](x) {
        this.#v = x;
    }
    // Public
    set v(x) {
        // Protected内では実行したくない何らかの処理がここに有る
        this[Protected.get(this.constructor, 'v')](x);
    }
}
class B extends A {
    init(x) {
        this[Protected.get(this.constructor, 'v')](x);
    }
}
```

しかしこれではまだstaticとinstanceのSymbolを区別して定義できない。

その違いはnameで区別させるべきか。

```
class A {
    static {
        Protected.set(this.constructor, 'sv'); // static
        Protected.set(this.constructor, 'v');  // instance
    }
    // Static
    static #v;
    static set [Protected.set(this.constructor, 'v')](x) {...}
    static set v(x) {...}
    // Instance Private
    #v;
    constructor() {}
    // Instance Protected
    set [Protected.get(this.constructor, 'v')](x) {
        this.#v = x;
    }
    // Instance Public
    set v(x) {
        // Protected内では実行したくない何らかの処理がここに有る
        this[Protected.get(this.constructor, 'v')](x);
    }
}
class B extends A {
    static init(x) {
        this[Protected.get(this.constructor, 'sv')](x);
    }
    init(x) {
        this[Protected.get(this.constructor, 'v')](x);
    }
}
```

同じ名前を使いたい時に不便だな。あとsetでなくaddにしたほうが良いのでは？　基本的に一度だけ追加するというか定義するはずだし。

```
Protected.s.add(this.constructor, 'v'); // static
Protected.i.add(this.constructor, 'v'); // instance
```

その前にバグ修正。


```
class Protected {
    static #map = new Map();

    static tryCls(v, n = 'B') {
        if ('function' !== typeof v) {
            throw new TypeError(`${n} はクラスであるべきです。:${v}`);
        }
    }
    static tryStr(v, n = 'name') {
        if ('string' !== typeof v) {
            throw new TypeError(`${n} は文字列であるべきです。:${v}`);
        }
    }

    static set(B, name) {
        this.tryCls(B);
        this.tryStr(name);

        if (!this.#map.has(B)) {
            this.#map.set(B, new Map());
        }
        const classMap = this.#map.get(B);
        if (!classMap.has(name)) {
            classMap.set(name, Symbol(name));
        }
        return classMap.get(name);
    }

    static get(C, name) {
        this.tryCls(C, 'C');
        this.tryStr(name);

        for (let [B, classMap] of this.#map) {
            if (B === C || B.isPrototypeOf(C)) {
                if (classMap.has(name)) {
                    return classMap.get(name);
                }
            }
        }
        throw new ReferenceError(`Cは登録済み基底クラスまたはその継承クラスではありません。あるいは指定されたプロパティ名が未登録です。C:${C.name}, name:${name}`);
    }
}

// --- 使用例 ---
class A {
    static {
        Protected.set(this, 'sv'); // static用
        Protected.set(this, 'v');  // instance用
    }

    // Static Protected
    static #sv;
    static set [Protected.get(this, 'sv')](x) {
        this.#sv = x;
    }
    static get [Protected.get(this, 'sv')]() {
        return this.#sv;
    }

    // Instance Protected
    #v;
    set [Protected.get(this.constructor, 'v')](x) {
        this.#v = x;
    }
    get [Protected.get(this.constructor, 'v')]() {
        return this.#v;
    }

    // Instance Public
    set v(x) {
        this[Protected.get(this.constructor, 'v')] = x;
    }
    get v() {
        return this[Protected.get(this.constructor, 'v')];
    }
}

class B extends A {
    static initStatic(x) {
        this[Protected.get(this, 'sv')] = x;
    }
    initInstance(x) {
        this[Protected.get(this.constructor, 'v')] = x;
    }
}

// 動作確認
B.initStatic(100);
console.log(B[Protected.get(B, 'sv')]); // 100

const b = new B();
b.initInstance(200);
console.log(b.v); // 200
```

try系は非公開APIにすべきでは？。

```
class Protected {
    static #map = new Map();

    static #tryCls(v, n = 'B') {
        if ('function' !== typeof v) {
            throw new TypeError(`${n} はクラスであるべきです。:${v}`);
        }
    }
    static #tryStr(v, n = 'name') {
        if ('string' !== typeof v) {
            throw new TypeError(`${n} は文字列であるべきです。:${v}`);
        }
    }

    static set(B, name) {
        this.#tryCls(B);
        this.#tryStr(name);

        if (!this.#map.has(B)) {
            this.#map.set(B, new Map());
        }
        const classMap = this.#map.get(B);
        if (!classMap.has(name)) {
            classMap.set(name, Symbol(name));
        }
        return classMap.get(name);
    }

    static get(C, name) {
        this.#tryCls(C, 'C');
        this.#tryStr(name);

        for (let [B, classMap] of this.#map) {
            if (B === C || B.isPrototypeOf(C)) {
                if (classMap.has(name)) {
                    return classMap.get(name);
                }
            }
        }
        throw new ReferenceError(`Cは登録済み基底クラスまたはその継承クラスではありません。あるいは指定されたプロパティ名が未登録です。C:${C.name}, name:${name}`);
    }
}

// --- 使用例 ---
class A {
    static {
        Protected.set(this, 'sv'); // static用
        Protected.set(this, 'v');  // instance用
    }

    // Static Protected
    static #sv;
    static set [Protected.get(this, 'sv')](x) {
        this.#sv = x;
    }
    static get [Protected.get(this, 'sv')]() {
        return this.#sv;
    }

    // Instance Protected
    #v;
    set [Protected.get(this.constructor, 'v')](x) {
        this.#v = x;
    }
    get [Protected.get(this.constructor, 'v')]() {
        return this.#v;
    }

    // Instance Public
    set v(x) {
        this[Protected.get(this.constructor, 'v')] = x;
    }
    get v() {
        return this[Protected.get(this.constructor, 'v')];
    }
}

class B extends A {
    static initStatic(x) {
        this[Protected.get(this, 'sv')] = x;
    }
    initInstance(x) {
        this[Protected.get(this.constructor, 'v')] = x;
    }
}

// 動作確認
B.initStatic(100);
console.log(B[Protected.get(B, 'sv')]); // 100

const b = new B();
b.initInstance(200);
console.log(b.v); // 200
```

# 実行結果

```sh
$ bun repl
Welcome to Bun v1.4.2
Type .copy [code] to copy to clipboard. .help for more info.

❯ class Protected {
...     static #map = new Map();
... 
...     static #tryCls(v, n = 'B') {
...         if ('function' !== typeof v) {
...             throw new TypeError(`${n} はクラスであるべきです。:${v}`);
...         }
...     }
...     static #tryStr(v, n = 'name') {
...         if ('string' !== typeof v) {
...             throw new TypeError(`${n} は文字列であるべきです。:${v}`);
...         }
...     }
... 
...     static set(B, name) {
...         this.#tryCls(B);
...         this.#tryStr(name);
... 
...         if (!this.#map.has(B)) {
...             this.#map.set(B, new Map());
...         }
...         const classMap = this.#map.get(B);
...         if (!classMap.has(name)) {
...             classMap.set(name, Symbol(name));
...         }
...         return classMap.get(name);
...     }
... 
...     static get(C, name) {
...         this.#tryCls(C, 'C');
...         this.#tryStr(name);
... 
...         for (let [B, classMap] of this.#map) {
...             if (B === C || B.isPrototypeOf(C)) {
...                 if (classMap.has(name)) {
...                     return classMap.get(name);
...                 }
...             }
...         }
...         throw new ReferenceError(`Cは登録済み基底クラスまたはその継承クラスではありません。あるいは指定されたプロパティ名が未登録です。C:${C.name}, name:${name}`);
...     }
... }
[class Protected]
❯ 
❯ // --- 使用例 ---
undefined
❯ class A {
...     static {
...         Protected.set(this, 'sv'); // static用
...         Protected.set(this, 'v');  // instance用
...     }
... 
...     // Static Protected
...     static #sv;
...     static set [Protected.get(this, 'sv')](x) {
...         this.#sv = x;
...     }
...     static get [Protected.get(this, 'sv')]() {
...         return this.#sv;
...     }
... 
...     // Instance Protected
...     #v;
...     set [Protected.get(this.constructor, 'v')](x) {
...         this.#v = x;
...     }
...     get [Protected.get(this.constructor, 'v')]() {
...         return this.#v;
...     }
... 
...     // Instance Public
...     set v(x) {
...         this[Protected.get(this.constructor, 'v')] = x;
...     }
...     get v() {
...         return this[Protected.get(this.constructor, 'v')];
...     }
... }
TypeError: C はクラスであるべきです。:[object Object]
      at #tryCls ([repl]:9:17)
      at get ([repl]:30:21)
      at <anonymous> ([repl]:11:32)
      at [repl]:32:3

❯ 
❯ class B extends A {
...     static initStatic(x) {
...         this[Protected.get(this, 'sv')] = x;
...     }
...     initInstance(x) {
...         this[Protected.get(this.constructor, 'v')] = x;
...     }
... }
TypeError: The superclass is not a constructor.
      at <anonymous> ([repl]:5:32)
      at [repl]:14:3

❯ 
❯ // 動作確認
undefined
❯ B.initStatic(100);
TypeError: undefined is not an object (evaluating 'B.initStatic')
      at <anonymous> ([repl]:4:13)
      at [repl]:6:3

❯ console.log(B[Protected.get(B, 'sv')]); // 100
TypeError: C はクラスであるべきです。:undefined
      at #tryCls ([repl]:9:17)
      at get ([repl]:30:21)
      at <anonymous> ([repl]:4:39)
      at [repl]:6:3

❯ 
❯ const b = new B();
TypeError: undefined is not a constructor (evaluating 'new B')
      at <anonymous> ([repl]:5:16)
      at [repl]:7:3

❯ b.initInstance(200);
TypeError: undefined is not an object (evaluating 'b.initInstance')
      at <anonymous> ([repl]:4:13)
      at [repl]:6:3

❯ console.log(b.v); // 200
TypeError: undefined is not an object (evaluating 'b.v')
      at <anonymous> ([repl]:4:25)
      at [repl]:6:3

❯ 
```









```
const instanceStore = new WeakMap(); // ins -> Map<Class, symbol>
const staticStore = new Map();     // Class -> symbol

/**
 * 共通の登録（set）ロジック
 */
function registerSymbol(storeMap, target, cls, initialObj) {
    if (!storeMap.has(target)) {
        storeMap.set(target, new Map());
    }
    const classMap = storeMap.get(target);
    if (!classMap.has(cls)) {
        const sym = Symbol(`protected_${cls.name}`);
        classMap.set(cls, sym);
        target[sym] = initialObj;
    }
    return classMap.get(cls);
}

/**
 * 責務1: プロトタイプチェーンを遡ってシンボルを探索する（self / super 用）
 */
function resolveFromHierarchy(chain, classMap, skipSelf) {
    if (!classMap) throw new ReferenceError(`protected 領域が見つかりません。`);
    
    let current = chain;
    let foundSelf = false;

    while (current && current !== Object) {
        if (classMap.has(current)) {
            if (!skipSelf) {
                return classMap.get(current); // self（直近）
            }
            if (foundSelf) {
                return classMap.get(current); // super（親）
            }
            foundSelf = true;
        }
        current = typeof current === 'function' 
            ? Object.getPrototypeOf(current) 
            : Object.getPrototypeOf(current.constructor);
    }
    throw new ReferenceError(`該当する protected 領域が見つかりません。`);
}

/**
 * 責務2: 指定されたクラスを直接マップから引く（狙い撃ち用）
 */
function resolveDirect(classMap, targetCls) {
    if (!classMap || !classMap.has(targetCls)) {
        throw new ReferenceError(`指定されたクラス (${targetCls?.name}) の領域がありません。`);
    }
    return classMap.get(targetCls);
}

export const protected = {
    i: {
        set(ins, ownCls, initialObj = {}) {
            return registerSymbol(instanceStore, ins, ownCls, initialObj);
        },
        self: {
            get(ins) { return resolveFromHierarchy(ins, instanceStore.get(ins), false); }
        },
        super: {
            get(ins) { return resolveFromHierarchy(ins, instanceStore.get(ins), true); }
        },
        get(ins, ownCls) {
            return resolveDirect(instanceStore.get(ins), ownCls);
        }
    },

    s: {
        set(cls, initialObj = {}) {
            if (!staticStore.has(cls)) staticStore.set(cls, new Map());
            return registerSymbol(staticStore, cls, cls, initialObj);
        },
        self: {
            get(cls) { return resolveFromHierarchy(cls, staticStore.get(cls), false); }
        },
        super: {
            get(cls) { return resolveFromHierarchy(cls, staticStore.get(cls), true); }
        },
        get(cls, ownCls) {
            return resolveDirect(staticStore.get(cls), ownCls);
        }
    }
};
```
