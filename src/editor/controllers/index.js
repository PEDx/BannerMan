const path = require('path');
const files = require.context('./', false, /\.vue$/);
const modules = {};
files.keys().forEach(key => {
  const name = path.basename(key, '.vue');
  modules[name] = files(key).default || files(key);
});
function toLine(name) {
  return name.toUpperCase().replace(/\-(\w)/g, function(all, letter) {
    return '_' + letter.toUpperCase();
  });
}
const map = {};
Object.keys(modules).forEach(key => {
  const name = toLine(key);
  map[name] = key;
});
export const controllerTypeMap = map;
export const controllers = modules;
