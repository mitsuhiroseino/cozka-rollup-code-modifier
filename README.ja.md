# @cozka/rollup-code-modifier

`@cozka/rollup-code-modifier` は、カスタム設定に基づいてトランスパイル後のコードを変更する Rollup プラグインです。コードの文字列置換や変換をバンドル中に行うことができます。

**[English READMEはこちら](./README.md)**

## インストール

```sh
npm install @cozka/rollup-code-modifier
```

## 使い方

プラグインを使用するには、`rollup.config.js` ファイルに以下のように追加します：

```javascript
import CodeModifier from '@cozka/rollup-code-modifier';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
  },
  plugins: [
    CodeModifier({
      modifiers: [
        {
          target: 'src/utils.js',
          pattern: /console\.log\(.*?\);?/g,
          replacement: '',
        },
        {
          target: /src\/components\/.*/,
          modify: (code) => code.replace('var ', 'let '),
        },
      ],
    }),
  ],
};
```

## 設定オプション

### `CodeModifierConfig`

| プロパティ  | 型                 | 説明                               |
| ----------- | ------------------ | ---------------------------------- |
| `modifiers` | `ModifierConfig[]` | コードを変更する設定のリストです。 |

### `ModifierConfig`

`ModifierConfig` は `CustomFunctionModifierConfig` または `PatternBasedModifierConfig` のいずれかです。

#### `CustomFunctionModifierConfig`

| プロパティ | 型                                             | 説明                                                                                              |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `target`   | `string \| RegExp`                             | 対象となるファイルを判定するための正規表現です。 指定しない場合は全てのファイルが対象となります。 |
| `modify`   | `(code: string, targetPath: string) => string` | ソースコードを変更する関数です。                                                                  |

#### `PatternBasedModifierConfig`

| プロパティ    | 型                   | 説明                                                                                              |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `target`      | `string \| RegExp`   | 対象となるファイルを判定するための正規表現です。 指定しない場合は全てのファイルが対象となります。 |
| `pattern`     | `string \| RegExp`   | ファイル内容に一致するパターンです。                                                              |
| `replacement` | `string \| function` | 一致した部分を置き換える文字列または関数です。                                                    |

## 注意点

- `sourcemap` を使用している場合、このプラグインによりソースコードと変換後のコードにズレが生じる可能性があります。

## ライセンス

MIT
