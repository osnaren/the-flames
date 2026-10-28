// Generate native light/dark colors from the authored palettes. Their token
// values stay stable during theme changes, avoiding inherited-map replacement
// across the entire document. Original rules remain the compatibility fallback.
module.exports = () => ({
  postcssPlugin: 'flames-adaptive-palette',
  OnceExit(root, { postcss }) {
    const light = new Map();
    const dark = new Map();
    root.walkRules((rule) => {
      const selectors = rule.selectors.map((selector) => selector.trim());
      const palette =
        selectors.includes('.dark') || selectors.some((selector) => /^\[data-theme=['"]?dark['"]?\]$/.test(selector))
          ? dark
          : selectors.includes(':root') || selectors.includes('.light')
            ? light
            : null;
      if (!palette) return;
      for (const node of rule.nodes) {
        if (node.type === 'decl' && node.prop.startsWith('--')) palette.set(node.prop, node.value);
      }
    });

    const isColor = (value) =>
      /^(?:#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8}|(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color|color-mix|var)\([\s\S]+\))$/i.test(
        value
      );
    const palette = postcss.rule({
      selector: ':root, :root.dark, :root.light, :root[data-theme="light"], :root[data-theme="dark"]',
    });
    for (const [name, darkColor] of dark) {
      const lightColor = light.get(name);
      if (lightColor && lightColor !== darkColor && isColor(lightColor) && isColor(darkColor)) {
        palette.append(postcss.decl({ prop: name, value: `light-dark(${lightColor}, ${darkColor})` }));
      }
    }
    if (!palette.nodes.length) return;

    const supports = postcss.atRule({ name: 'supports', params: '(color: light-dark(white, black))' });
    supports.append(palette);
    const lightMode = postcss.rule({ selector: ':root' });
    lightMode.append(postcss.decl({ prop: 'color-scheme', value: 'light' }));
    const darkMode = postcss.rule({ selector: ':root.dark, :root[data-theme="dark"]' });
    darkMode.append(postcss.decl({ prop: 'color-scheme', value: 'dark' }));
    supports.append(lightMode, darkMode);
    root.append(supports);
  },
});
module.exports.postcss = true;
