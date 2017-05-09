export default class Inventory {
  constructor() {
    /** @private {Array<Item>} */
    this._items = [];
  }
  get length() {
    return this._items.length;
  }
}