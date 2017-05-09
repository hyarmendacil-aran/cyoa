export default class Listenable {
  constructor() {
    /**
     * @type {Array<function()>}
     */
    this._changeListeners = [];
  }

  /**
  * @param {function()} listener;
  */
  addChangeListener(listener) {
    this._changeListeners.push(listener);
  }

  /**
  * @param {function()} listener;
  */
  removeChangeListener(listener) {
    this._changeListeners =
      this._changeListeners.filter((item) => item != listener);
  }

  _notifyChange() {
    for (let listener of this._changeListeners) {
      listener();
    }
  }
}