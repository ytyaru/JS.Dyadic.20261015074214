テストはクリアした。しかし設計がダメだな。tis.aryやinsにおいて第二引数がある時はセッターでなくset()を呼び出さねばならずAPIが統一できない。また、cls.es6などネストしているAPIはそもそも参照すらできない。これらの問題をどうにかして解決すべきだ。

`T.ary`,`V.ary`などは名前で指定した型用のインスタンスを返却するゲッターである。しかしこれがゲッターであるため、tisのようにネストして詳細型を指定することができない。また、V.ary.vのセッターを使って値を代入する時、tisの第二引数を指定することができない。

できることならtisの第二引数やネストは、Typeの型判定isFnで指定すべきだ。但し第二引数については大量のパターンがあり予め用意することは難しい。なので動的生成させるAPIを用意するしかない。TypeやValueを使えば可能ではあるものの、tis.ary|ins(v,...), tis.ins|cls.es6|es5|natなど、これらの型をどう簡単に動的生成できるAPIを用意してやるべきか？

以下のように生成用の新しいAPIを用意するにしても、型情報として第二引数を持てないのが問題だな。

```javascript
export const N = {
    ary: {
    cls: {
        es6: {
            t: C => new Type(tis.cls.es6(v,C), _=>null),
            v: V => new Value(N.cls.es6.t, _=>0),
        }
    },
}
```

Typeコンストラクタの第一引数のisFnは関数だが、その関数であるtis.cls.es6に加え、第二引数Cまで持たねばならない。この時、vは持ってはならない。その時々で変更可能にすべきだ。なのでbindでも不可能。

```javascript
export const N = {
    cls: {
        es6: {
            t: C => new Type(tis.cls.es6.bind(null,null,C), _=>null),
            v: V => new Value(N.cls.es6.t, _=>0),
        }
    },
}
```

jsにおいて、bind関数で引数を固定した別関数を作ることができる。この時、第一引数だけは毎回呼び出し時に渡せて、かつ第二引数以降は固定にするような関数をbind関数で作ることは可能か？

```javascript
export const N = {
    cls: {
        es6: {
            t: C => new Type(v=>tis.cls.es6(v,C), _=>null),
            v: (C, s=Value.onSets.throw) => new Value(N.cls.es6.t(C), s),
        }
    },
    ary: {
        t: f => new Type(v=>tis.ary(v,f), _=>[]),
        v: (f, s=Value.onSets.throw) => new Value(N.ary.t(f), s),
    }
}
```

一応これならできそうか？　しかしvが冗長だ。そもそもTypeが生成されたならValueも作れるのでは？　Typeのインスタンスメソッドで。

```javascript
class Type {
    newV(s=Value.onSets.throw) {return Value(this, s)}
}
```

これなら`N.ary(f)`でTypeを、`N.ary(f).newV(s)`でValueを生成できる。

```javascript
export const NT = {
    ary: f => new Type(v=>tis.ary(v,f), _=>[]),
    cls: {
        es6: C => new Type(v=>tis.cls.es6(v,C), _=>null),
        es5: C => new Type(v=>tis.cls.es5(v,C), _=>null),
        nat: C => new Type(v=>tis.cls.nat(v,C), _=>null),
    },
    ins: {
        es6: C => new Type(v=>tis.ins.es6(v,C), _=>null),
        es5: C => new Type(v=>tis.ins.es5(v,C), _=>null),
        nat: C => new Type(v=>tis.ins.nat(v,C), _=>null),
    },
}
export const NV = {
    ary: (s=Value.onSets.throw) => new Value(NT.ary, s),
    cls: {
        es6: (s=Value.onSets.throw) => new Value(NT.cls.es6, s),
        es5: (s=Value.onSets.throw) => new Value(NT.cls.es5, s),
        nat: (s=Value.onSets.throw) => new Value(NT.cls.nat, s),
    },
    ins: {
        es6: (s=Value.onSets.throw) => new Value(NT.ins.es6, s),
        es5: (s=Value.onSets.throw) => new Value(NT.ins.es5, s),
        nat: (s=Value.onSets.throw) => new Value(NT.ins.nat, s),
    },
}
```

ちょっと待てよ？　もっと最適化できるのでは？

全APIはゲッターでなく関数にすべきでは？　Nullable指定もあるのだから。第一引数はtrueならNullable、第二引数はaryやinsやclsの第二引数。そしてゲッターでなく関数にできたならネスト可能になるのでtisを踏襲する。

```javascript
const isN = args => 0<args.length && true===args[0]; // Nullable
const T = {
    bln: (nullable) => new Type((isN(nullable) ? tis.blnN : tis.bln), _=>(isN(nullable) ? _=>null : _=>false)),
    ...
    ary: (nullable, elIsFn) => new Type((isN(nullable) ? v=>tis.aryN(v,elIsFn) : v=>tis.ary(v,elIsFn)), _=>(isN(nullable) ? _=>null : _=>[])),
    ...
    cls: (nullable, C) => new Type((isN(nullable) ? v=>tis.clsN(v,C) : v=>tis.cls(v,C)), _=>(isN(nullable) ? _=>null : _=>class{})),
    ins: (nullable, C) => new Type((isN(nullable) ? v=>tis.insN(v,C) : v=>tis.ins(v,C)), _=>(isN(nullable) ? _=>null : _=>class{})),
    ...
}
T.cls.es6 = new Type((isN(args) ? tis.cls.es6N : tis.cls.es6), _=>(isN(nullable) ? _=>null : _=>class{}));
...
```

```javascript
const isN = args => 0<args.length && true===args[0]; // Nullable
const getOnSet = v => 'function'===v ? v : Value.onSets.throw;
const V = {
    bln: (nullable, onSet) => new Value(T.bln(nullable), getOnSet(onSet)),
    ...
    ary: (nullable, elIsFn, onSet) => new Value(T.ary(nullable, elIsFn), getOnSet(onSet)),
    ...
    cls: (nullable, C, onSet) => new Value((isN(nullable, C) ? v=>tis.clsN(v,C) : v=>tis.cls(v,C)), getOnSet(onSet)),
    cls: (nullable, C, onSet) => new Value((isN(nullable, C) ? v=>tis.insN(v,C) : v=>tis.ins(v,C)), getOnSet(onSet)),
    ...
}
T.cls.es6 = (nullable, onSet) => new Value((isN(args) ? tis.cls.es6N : tis.cls.es6), getOnSet(onSet));
...
```

やはり値ValueはTypeを生成後にnewV()経由で生成させるのが得策だ。Vから直接やろうとするとTypeの引数を渡さねばならなくなるから。

値Valueのほうはnullableの他にmutableの是非も指定したい。

各コンストラクタに以下を追加する必要がある。

* 型: Type
    * nullable, tis第二引数(elIsFn, C)
* 値: Value
    * mutable

既にいくつも引数がある。全部合わせると以下。

* 型: Type
    * isFn, dFn
    * nullable, tis第二引数(elIsFn, C)
* 値: Value
    * type, onSet
    * mutable

引数の順序はどうすべきか。

Typeの主要な部分はisFnだ。これが最優先。次にnullableも大きな法則性だ。これによってisFnやdFnが変わる。nullable=trueならisFnの式をアロー関数でラップして`null===v || isFn(v)`とする。dFnは`_=>null`になる。

```javascript
new Type(isFn, nullable, dFn, ...exts);
new Value(type, mutable, onSet)
```

変数にはnullable, mutableの他に何がある？

lazy（遅延初期化。評価時期）だな。
参照型は必要になりそうだ。

1. 型定義
2. 変数宣言（名付け）
3. 初期化（値代入）
4. 参照

上記の工程になる。場合によっては初期化は初回参照時に行われる可能性もある。ということは、初期化をいつ、どうやってやるかを定義する必要が、変数にはある、ということか。

初期化をどうやるかはコールバック関数を渡せばいいとして。初回参照時であるか否かはどう評価すればいいか。特に難しいのがNullableな変数の時の初回か否か判定の方法だ。もし非Nullableなのにnullの時は未初期化であると判断できる。だが、Nullableの時は未初期化なのかnullが代入された結果なのか見分けがつかない。だからといってそのために初期化済みフラグをもたせるのも馬鹿げている。

ああそうか。Symbolを使えばいいのか。JavaScriptのSymbolを使って特定のSymbolであるか否かの判定を参照時に毎回やればいいのか。`const UNINIT = Symbol('Value.uninitialized');`とか定義しておいてそれを使えばいいんだ。

でも毎回参照時に実行するのは無駄だなぁ。でもDRYに書くにはこういう方法しかないし。

それより、もし初期化に引数が必要なら、ゲッターで参照する時に渡せないんだが。呼び出し方がLasyかつ引数ありの場合、ゲッターで参照した時に初期化できないという話になってしまう。これが一番の問題だ。どうしよう。まさか初期化用メソッドなんて用意しちゃったら呼び出し忘れが起きてしまうから絶対ダメだし。自動化するにはどこかの段階で初期化用引数を渡さなきゃいけない。でもまだその値が宣言時には不明な場合もある。これはもう、初期化用メソッドを呼び出す必要がある型の場合、それがされる前に参照されたら例外発生させるしかない。更に、初期化メソッドを呼び出しちゃいけないAPIに関してはそもそもメソッド自体を用意しないか、あるいは呼び出したら例外発生するようにしなきゃダメだ。

```
const UNINIT = Symbol(); // 'Value.uninitialized'
class LazyValue extends Value {
    constructor(type, mutable=false, onSet=Value.onSets.throw) {
        super(type, mutable, onSet);
//        this.#type = this.#tryType(type);
//        this.#mutable = this.#tryMutalbe(mutalbe);
//        this.#onSet = tryFn(onSet, 'onSet');
//        this.#v = this.#type.default;
//        this.#v = UNINIT;
        this.#onInit = this.#tryType(onInit);
        this.v = UNINIT; // これができない！　isFnに違反する！
    }
    init(...args) {return this.#onInit(this, ...args)}
    get v() {
        if (UNINIT === this.#v) {throw new ReferenceError(`未初期化なのに参照されました。参照前にinit()を呼び出してください。`)}
//        return this.#v;
        return super.v;
    }
    set v(x) {
        if (UNINIT === this.#v) {throw new ReferenceError(`未初期化なのに代入されました。代入前にinit()を呼び出してください。`)}
        super.v = v;
//        this.#type.is(x) ? this.#v=x : this.#onSet([x], this);
    }

}
```

protectedメンバ変数を定義できないせいで公開しなきゃいけなくなる。困った。

```
const dangerSetV = Symbol();
class Value {
    #v;
    constructor(type, mutable=false, onSet=Value.onSets.throw) {...}
    set [dangerSetV](x) {this.#v = x;}
}
class LazyValue extends Value {
    #onInit;
    constructor(type, mutable=false, onSet=Value.onSets.throw) {
        super(type, mutable, onSet);
        this.#onInit = this.#tryType(onInit);
        this[dangerSetV] = UNINIT;
    }
}
```


お前の方法だとValueをextendsした独自クラスは未登録だから対象外という不自然な状況になってしまう。あるいはValueクラスと全然関係ないクラスさえ登録できてしまう。Valueを継承したクラスなら鍵を返すようにすべきだ。

```
const dangerSetV = Symbol();
export class Value {
    #v;
    constructor(type, mutable=false, onSet=Value.onSets.throw) {...}
    set [dangerSetV](x) {this.#v = x;}
}
export class LazyValue extends Value {
    #onInit;
    constructor(type, mutable=false, onSet=Value.onSets.throw) {
        super(type, mutable, onSet);
        this.#onInit = this.#tryType(onInit);
        this[dangerSetV] = UNINIT;
    }
}
export getDangerSetVSymbol(cls) {return clsのprototypeを全て遡りValueと一致するなら真、しないなら偽を返す}
```

```
// 外部には絶対に export しない（このファイル内だけの秘密）
const dangerSetV = Symbol('dangerSetV');

export class Value {
  #v;
  constructor(type, mutable = false, onSet = null) {
    // 省略
  }

  set [dangerSetV](x) {
    this.#v = x;
  }
}

// 鍵（Symbol）を安全に引き渡すための関数
export function getDangerSetVSymbol(cls) {
  // cls が関数（クラス）であり、かつ Value のプロトタイプチェーンに含まれているか判定
  // （cls === Value 自体も許可するか、または子クラスのみにするかで条件を微調整できます）
  if (typeof cls === 'function' && (cls === Value || Value.isPrototypeOf(cls))) {
    return dangerSetV;
  }
  
  // 条件を満たさない（無関係な）クラスからの要求にはエラーを投げる、または null を返す
  throw new TypeError("Access denied: Only subclasses of Value can access protected members.");
}
```

このgetDangerSetVSymbol(cls)はValueのstaticメソッドとして定義すべきでは？
dangerSetV の定義も#でプライベート値としてValueのstaticで持つべきでは？

```
export class Value {
  // 1. SymbolをValueクラスのプライベート静的プロパティとして完全に隠蔽
  static #dangerSetV = Symbol('dangerSetV');
  // 2. 外部（サブクラス含む）からこの検証メソッドを通してのみSymbolを取得できるようにする
  static getDangerSetVSymbol(cls) {
    if (typeof cls === 'function' && (cls === Value || Value.isPrototypeOf(cls))) {
      return Value.#dangerSetV;
    }
    throw new TypeError("Access denied: Only subclasses of Value can access protected members.");
  }
  
  #v;
  constructor(type, mutable = false, onSet = null) {
    // 省略
  }
  // 自身のクラス内であれば、もちろんValue.#dangerSetVでセッターを定義・参照可能
  set [Value.#dangerSetV](x) {
    this.#v = x;
  }
}
```

```
import { Value } from './Value.js';

const UNINIT = Symbol('UNINIT');

export class LazyValue extends Value {
  #onInit;

  // 静的初期化ブロックで、親クラスのstaticメソッドから鍵（Symbol）を安全に取得
  static {
    LazyValue.prototype._dangerSetV = Value.getDangerSetVSymbol(LazyValue);
  }

  constructor(type, mutable = false, onSet = null, onInit) {
    super(type, mutable, onSet);
    this.#onInit = onInit;

    // 取得した Symbol を使って、安全にプロテクトメソッド（セッター）へアクセス
    this[this._dangerSetV] = UNINIT;
  }
}
```

いやいやなんで_dangerSetVなどという無駄な公開プロパティ作っちゃうの？なんのためのprotected化だよ。バカすぎる。

```
import { Value } from './Value.js';

const UNINIT = Symbol('UNINIT');

export class LazyValue extends Value {
  #onInit;
  constructor(type, mutable = false, onSet = null, onInit) {
    super(type, mutable, onSet);
    this.#onInit = onInit;

    // 取得した Symbol を使って、安全にプロテクトメソッド（セッター）へアクセス
    this[Value.getDangerSetVSymbol(LazyValue)] = UNINIT;
  }
}
```

UNINITはLazyValue内の#で定義すべきでは？


```
import { Value } from './Value.js';

export class LazyValue extends Value {
  // UNINIT もクラスのプライベート静的領域に完全に閉じ込める
  static #UNINIT = Symbol('UNINIT');
  
  #onInit;

  constructor(type, onInit, mutable = false, onSet = null) {
    super(type, mutable, onSet);
    this.#onInit = onInit;

    // 外部からアクセスできないクラス内部の #UNINIT を安全に代入
    this[Value.getDangerSetVSymbol(LazyValue)] = LazyValue.#UNINIT;
  }
}
```





```
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

}
```

