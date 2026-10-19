import { expect, test, describe } from "bun:test";

// テスト失敗時に発生させるカスタムエラー
class TestError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestError";
    }
}
const th = m => {throw new TestError(m);}
export const assertThrow = (Err, msg, fn) => {
    try {
        fn();
        th("例外発生しませんでした。");
    } catch (error) {
        // 自前で投げた TestError はそのままスルーして外へ伝える
        if (error instanceof TestError) {throw error;}
        // 1. エラー型のチェック
        if (error instanceof Err) {expect(error).toBeInstanceOf(Err);}
        else {th(`期待されたエラー型 (${Err.name}) と実際のエラー型 (${error.constructor.name}) が一致しません。`);}
        // 2. メッセージのチェック（文字列なら完全一致、正規表現なら test() 判定）
        if (typeof msg === "string") {
            if (error.message === msg) {expect(error.message).toBe(msg);}
            else {th(`エラーメッセージが完全一致しません。\n期待値: "${msg}"\n実際値: "${error.message}"`);}
        } else if (msg instanceof RegExp) {
            if (msg.test(error.message)) {expect(msg.test(error.message)).toBe(true);
            } else {th(`エラーメッセージが正規表現にマッチしません。\n正規表現: ${msg}\n実際値: "${error.message}"`);}
        }
    }
};
/*
// ==========================================
// 正常確認（bun:test によるテストコード）
// ==========================================
describe("assertThrowのテスト", () => {
    test("期待通りのエラー型と完全一致のメッセージで成功する", () => {
        const fn = () => {
            throw new TypeError("無効な引数です");
        };
        // 例外が発生しなければそのまま通過する
        assertThrow(TypeError, "無効な引数です", fn);
    });

    test("期待通りのエラー型と正規表現のメッセージで成功する", () => {
        const fn = () => {
            throw new Error("User ID: 999 not found");
        };
        assertThrow(Error, /^User ID: \d+ not found$/, fn);
    });

    test("エラーが発生しない場合に TestError が発生する", () => {
        const fn = () => {
            // エラーを投げない処理
        };
        expect(() => {
            assertThrow(Error, "何らかのエラー", fn);
        }).toThrow(TestError);
    });

    test("エラー型が異なる場合に TestError が発生する", () => {
        const fn = () => {
            throw new TypeError("エラーメッセージ");
        };
        expect(() => {
            assertThrow(ReferenceError, "エラーメッセージ", fn);
        }).toThrow(TestError);
    });

    test("エラーメッセージ（文字列）が一致しない場合に TestError が発生する", () => {
        const fn = () => {
            throw new Error("実際のメッセージ");
        };
        expect(() => {
            assertThrow(Error, "期待したメッセージ", fn);
        }).toThrow(TestError);
    });

    test("エラーメッセージ（正規表現）にマッチしない場合に TestError が発生する", () => {
        const fn = () => {
            throw new Error("Invalid format");
        };
        expect(() => {
            assertThrow(Error, /^Valid/, fn);
        }).toThrow(TestError);
    });
});
*/
