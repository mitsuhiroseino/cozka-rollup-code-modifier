import { Plugin } from 'rollup';
import path from 'path';

/**
 * コンフィグ
 */
export type CodeModifierConfig = {
  /**
   * 文字列変換の設定
   */
  modifiers?: ModifierConfig[];
};

/**
 * 文字列変換設定
 */
export type ModifierConfig =
  | CustomFunctionModifierConfig
  | PatternBasedModifierConfig;

/**
 * 関数文字列編集設定
 */
export type CustomFunctionModifierConfig = ModifierConfigBase & {
  /**
   * 任意の変換処理を行う関数
   * @param code ソースコード
   * @param targetPath `/`区切りの相対パス
   * @returns 変換処理後のソースコード
   */
  modify: (code: string, targetPath: string) => string;
};

/**
 * パターン文字列置換設定
 */
export type PatternBasedModifierConfig = ModifierConfigBase & {
  /**
   * ファイルの内容の置換を行う際のパターン\
   * `replacer`が指定されている場合は無効
   */
  pattern: string | RegExp;

  /**
   * パターンに一致した個所を置き換える文字列または関数\
   * `replacer`が指定されている場合は無効
   */
  replacement: string | ((substring: string, ...args: any[]) => string);
};

/**
 * 編集設定ベース
 */
export type ModifierConfigBase = {
  /**
   * 編集処理の対象を判定するための正規表現\
   * `/`区切りの相対パスに対して判定を行う\
   * 文字列の場合は部分一致、正規表現の場合はtestメソッドで判定\
   * 未指定の場合は全ファイルが対象
   */
  target?: string | RegExp;
};

/**
 * トランスパイル後のソースコードを設定に従い編集するプラグイン
 */
export default function CodeModifier(config: CodeModifierConfig): Plugin {
  const { modifiers = [] } = config;
  return {
    name: 'code-modifier',
    options(options) {
      const output = options['output'];
      if (output) {
        const outputs = Array.isArray(output) ? output : [output];
        if (outputs.some((config) => !!config.sourcemap)) {
          this.warn(
            'Using the code-modifier plugin may cause source map discrepancies.',
          );
        }
      }
    },
    transform: (code, id) => {
      const relativePath = path.relative(process.cwd(), id);
      const normalizedPath = relativePath.replace(/\\/g, '/');
      let modifiedCode = code;
      for (const modifier of modifiers) {
        const target = modifier.target;
        if (
          !target ||
          (typeof target === 'string'
            ? normalizedPath.includes(target)
            : target.test(normalizedPath))
        ) {
          if ('modify' in modifier) {
            modifiedCode = modifier.modify(code, normalizedPath);
          } else {
            // @ts-ignore
            modifiedCode.replace(modifier.pattern, modifier.replacement);
          }
        }
      }
      return { code: modifiedCode, map: null };
    },
  };
}
