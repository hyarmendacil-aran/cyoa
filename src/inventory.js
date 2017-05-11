import Listenable from './listenable';
import { ItemJson } from './json_types';

export default class Inventory extends Listenable {
  /**
   * @param {Array<ItemJson>} allItems
   */
  constructor(allItems) {
    super();
    /** @private {Object<ItemJson>} */
    this._items = {};
    /** @private {Object<ItemJson>} */
    this._allItems = {};
    for (let item of allItems) {
      this._allItems[item.name] = item;
    }
  }

  get length() {
    return this._items.length;
  }

  /**
   * @return {Array<ItemJson>}
   */
  getItems() {
    // It'll be nice when Object.values() is in all browsers.
    return Object.keys(this._items).map((key) => this._items[key]);
  }

  /**
   * @param {string} name
   */
  hasItem(name) {
    return !!this._items[name];
  }

  /**
   * @param {string} name
   * @return {ItemJson}
   */
  getItem(name) {
    return this._items[name];
  }

  /**
   * @param {string} name
   */
  addItem(name) {
    const item = this._allItems[name];
    this._items[name] = item;
    this._notifyChange();
  }

  /**
   * @param {string} name
   */
  removeItem(name) {
    delete this._items[name];
    this._notifyChange();
  }
}