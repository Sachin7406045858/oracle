// Maps original "uploads/..." relative paths (as used in the source .dc.html/js/css files)
// to the bundled asset URL, so components/CSS-in-JS can reference images the same way
// the original static site did.
const modules = import.meta.glob('../assets/**/*', { eager: true, query: '?url', import: 'default' });

const map = {};
for (const path in modules) {
  // path looks like "../assets/icons/icon-xxxx.svg" -> key "icons/icon-xxxx.svg"
  const key = path.replace('../assets/', '');
  map[key] = modules[path];
}

export function up(relPath) {
  // relPath like "uploads/icons/icon-xxxx.svg" or "icons/icon-xxxx.svg"
  const key = relPath.replace(/^uploads\//, '');
  return map[key] || '';
}

export default up;
