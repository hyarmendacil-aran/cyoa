import Encounter from './encounter';
import Inventory from './inventory';
import Listenable from './listenable';

export default class MainCharacter extends Listenable {
  /**
   * Constructs a brand new character (as in character creation).
   * @param {string} name
   */
  constructor(name) {
    super();
    /** @type {string} */
    this._name = name;

    this._stats = {};
    this._flags = {};

    this._inventory = new Inventory();
  }

  get name() {
    return this._name;
  }

  /**
   * @param {string} name
   * @param {number} initialValue
   * @param {string} title
   * @param {boolean} visible
   */
  defineStat(name, initialValue, title, visible) {
    if (this._stats[name] !== undefined) {
      throw Error(`stat ${name} already defined`);
    }
    this._stats[name] = initialValue;
  }

  listStats() {
    return this._stats;
  }

  /**
   * @param {string} name
   * @return {number}
   */
  getStat(name) {
    if (this._stats[name] === undefined) {
      throw Error(`unknown stat ${name}`);
    }
    return this._stats[name];
  }

  /**
   * @param {string} name
   * @param {number} value
   */
  setStat(name, value) {
    if (this._stats[name] === undefined) {
      throw Error(`unknown stat ${name}`);
    }
    this._stats[name] = Math.max(value, 0);
    this._notifyChange();
  }

  /**
   * @param {string} name
   * @param {number} amount
   */
  addToStat(name, amount) {
    this.setStat(name, this.getStat(name) + amount);
  }

  /**
   * @param {string} name
   * @param {number} amount
   */
  deductFromStat(name, amount) {
    this.addToStat(name, -amount);
  }

  /**
  * @param {{changeStats: Array|undefined, setFlags: Array|undefined, giveItems: Array|undefined, takeItems: Array|undefined}} effects
  */
  applyEffects(effects, encounter) {
    for (let effect of effects) {
      for (let obj of (effect.changeStats || [])) {
        this.addToStat(obj.name, obj.add);
      }
      for (let flag of (effect.setFlags || [])) {
        if (flag.global) {
          this._flags[flag.name] = flag.value;
        } else {
          encounter.setFlag(flag.name, flag.value);
        }
      }
      for (item of effect.giveItems || []) {
        // TODO: implement items.
      }
      for (item of effect.takeItems || []) {
        // TODO: implement items.
      }
    }
  }

  /**
   * @param {Array<{stats: Array|undefined, useItems: Array|undefined, equippedItems: Array|undefined, flags: Array|undefined}>} requirements
   * @param {Encounter} encounter
   * @return {boolean}
   */
  evaluateRequirements(requirements, encounter) {
    // TODO: implement other requirement types.
    for (let requirement of requirements) {
      for (let flag of (requirement.flags || [])) {
        if (flag.global) {
          if ((this._flags[flag.name] || false) != flag.value) {
            return false;
          }
        } else {
          if (encounter.getFlag(flag.name) != flag.value) {
            return false;
          }
        }
      }
    }
    return true;
  }

  resetUsedItems() {
    // TODO: implement.
  }

  getInventory() {
    return this._inventory;
  }
}