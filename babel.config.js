// Expo's default Babel config is just `babel-preset-expo`. We split it into two
// mutually exclusive overrides so the preset still runs exactly once per file,
// but disables the React Compiler for files under `src/widgets/`.
//
// Why: `app.json` enables the React Compiler (experiments.reactCompiler). The
// compiler rewrites components to use a module-level memo cache (imported as
// `_c`). The `expo-widgets` `'widget'` directive serializes only a component's
// function *body* into the widget's separate JS runtime, where that module-level
// `_c` import doesn't exist, so a compiled widget throws "Can't find variable: _c"
// at runtime. The compiler also compiles nested helper components (e.g. inside the
// Live Activity), so a per-function `'use no memo'` directive isn't enough — the
// whole widget module must opt out.
//
// `test` must be a FUNCTION (not a RegExp): Metro computes its transform cache key
// by loading this config with no filename, and Babel throws on string/RegExp
// override patterns when no filename is present. With no filename we fall back to
// the non-widget (React Compiler on) branch.
const isWidget = (filename) => !!filename && /[\\/]widgets[\\/]/.test(filename);

module.exports = function (api) {
  api.cache(true);
  return {
    overrides: [
      { test: (filename) => !isWidget(filename), presets: ['babel-preset-expo'] },
      { test: isWidget, presets: [['babel-preset-expo', { 'react-compiler': false }]] },
    ],
  };
};
