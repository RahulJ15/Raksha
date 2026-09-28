// Parses the prototype's inline CSS strings into React style objects (memoized; strings repeat every frame).
const cache = new Map();

const camel = (prop) => {
  if (prop.startsWith('--')) return prop;
  const p = prop.startsWith('-webkit-') ? 'Webkit-' + prop.slice(8) : prop;
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
};

export function css(text) {
  let style = cache.get(text);
  if (style) return style;
  style = {};
  for (const decl of text.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (prop && val) style[camel(prop)] = val;
  }
  if (cache.size > 4000) cache.clear();
  cache.set(text, style);
  return style;
}
