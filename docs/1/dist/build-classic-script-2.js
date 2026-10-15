import fs from "fs";
import * as acorn from "acorn";
import * as escodegen from "escodegen";

// テスト用ソースコード（コメントや文字列に export が混ざっている）
const code = `
  // コメント内の export は消さない
  const str = "文字列内の export も消さない";
  export const x = 42;
  export function greet() {
    console.log("export in function execution should remain");
  }
  const internalValue = "secret";
  export { internalValue as renamed };
`;

// 1. 本物のパーサーで抽象構文木（AST）に変換（コメントや文字列に惑わされません）
const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });

const exportNames = [];
const newBody = [];

// 2. 構文木を走査し、export 構文だけを安全に分解・除去する
for (const node of ast.body) {
  if (node.type === "ExportNamedDeclaration") {
    // パターンA: export const x = 42; や export function greet() {} の場合
    if (node.declaration) {
      newBody.push(node.declaration); // `export` を剥ぎ取った中身（const x = 42 など）だけを移植
      
      if (node.declaration.type === "VariableDeclaration") {
        for (const decl of node.declaration.declarations) {
          exportNames.push(decl.id.name);
        }
      } else if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") {
        exportNames.push(node.declaration.id.name);
      }
    }
    // パターンB: export { internalValue as renamed }; の場合
    else if (node.specifiers) {
      for (const spec of node.specifiers) {
        exportNames.push(spec.exported.name);
        // 名前が変わっている場合は割り当て用の変数を生成 (const renamed = internalValue)
        if (spec.local.name !== spec.exported.name) {
          newBody.push({
            type: "VariableDeclaration",
            kind: "const",
            declarations: [{
              type: "VariableDeclarator",
              id: { type: "Identifier", name: spec.exported.name },
              init: { type: "Identifier", name: spec.local.name }
            }]
          });
        }
      }
    }
  } else {
    // export 以外の通常の構文（コメントや文字列を含むもの）はそのまま保持
    newBody.push(node);
  }
}

// ASTの本体を入れ替え
ast.body = newBody;

// 3. export が完全に消去された安全なJavaScriptコードを再生成
const cleanedCode = escodegen.generate(ast);

// 4. IIFE（Classic Script形式）として組み立て、globalThis に生やす
const finalClassicScript = `
(function() {
${cleanedCode}

// --- エクスポート対象を globalThis に自動展開 ---
const __exports = { ${exportNames.join(", ")} };
Object.entries(__exports).forEach(([key, value]) => {
  globalThis[key] = value;
});
})();
`.trim();

console.log(finalClassicScript);

