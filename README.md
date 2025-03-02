# @gusok/rollup-code-modifier

`@gusok/rollup-code-modifier` is a Rollup plugin that allows you to modify the transpiled code based on a custom configuration. You can use it to perform various string replacements or transformations on the source code during the bundling process.

**[日本語のREADMEはこちら](./README.ja.md)**

## Installation

```sh
npm install @gusok/rollup-code-modifier
```

## Usage

To use the plugin, add it to your `rollup.config.js` file as follows:

```javascript
import CodeModifier from '@gusok/rollup-code-modifier';

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

## Configuration Options

### `CodeModifierConfig`

| Property    | Type               | Description                                    |
| ----------- | ------------------ | ---------------------------------------------- |
| `modifiers` | `ModifierConfig[]` | List of configurations for modifying the code. |

### `ModifierConfig`

`ModifierConfig` can be either a `CustomFunctionModifierConfig` or a `PatternBasedModifierConfig`.

#### `CustomFunctionModifierConfig`

| Property | Type                                           | Description                                                                                           |
| -------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `target` | `string \| RegExp`                             | A regular expression to determine which files are affected. If not specified, all files are affected. |
| `modify` | `(code: string, targetPath: string) => string` | A function that modifies the source code.                                                             |

#### `PatternBasedModifierConfig`

| Property      | Type                 | Description                                                                                           |
| ------------- | -------------------- | ----------------------------------------------------------------------------------------------------- |
| `target`      | `string \| RegExp`   | A regular expression to determine which files are affected. If not specified, all files are affected. |
| `pattern`     | `string \| RegExp`   | The pattern to match in the file content.                                                             |
| `replacement` | `string \| function` | The string or function to replace the matched pattern.                                                |

## Notes

- If you're using `sourcemap`, this plugin might cause discrepancies between the source code and the transformed code.

## License

MIT
