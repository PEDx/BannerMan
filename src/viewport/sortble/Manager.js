export default class Manager {
  constructor() {
    this.refs = [];
  }
  add(ref) {
    if (!this.refs) {
      this.refs = [];
    }
    this.refs.push(ref);
  }
  remove(ref) {
    const index = this.getIndex(ref);

    if (index !== -1) {
      this.refs.splice(index, 1);
    }
  }
  getRefs() {
    return this.refs;
  }
  getIndex(ref) {
    return this.refs.indexOf(ref);
  }
  getOrderedRefs() {
    if (!this.refs) {
      return null;
    }
    return this.refs.sort((a, b) => {
      return a.node.sortableInfo.index - b.node.sortableInfo.index;
    });
  }
}
