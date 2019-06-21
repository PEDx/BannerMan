import { stringify, parse } from './utils/index';

export default {
  get(key) {
    try {
      return parse(localStorage.getItem(key));
    } catch (e) {
      console.error(e);
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, stringify(val));
    } catch (e) {
      console.error(e);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  },
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
  }
};
