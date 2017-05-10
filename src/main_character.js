import Encounter from './encounter';
import Inventory from './inventory';
import Listenable from './listenable';
import { EffectsJson, ItemJson, RequirementsJson } from './json_types';

export default class MainCharacter extends Listenable {
  /**
   * Constructs a brand new character (as in character creation).
   * @param {string} name
   * @param {Array<ItemJson>} allItems
   */
  constructor(name, allItems) {
    super();
    /** @type {string} */
    this._name = name;

    this._stats = {};
    this._flags = {};
    this._usedItem = null;
    this._equippedItems = null;

    this._inventory = new Inventory(allItems);
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
  * @param {Array<EffectsJson>} effects
  * @param {Encounter} encounter
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
      for (let item of effect.giveItems || []) {
        this._inventory.addItem(item);
      }
      for (let item of effect.takeItems || []) {
        this._inventory.removeItem(item);
      }
    }
  }

  /**
   * @param {Array<RequirementsJson>} requirements
   * @param {Encounter} encounter
   * @return {boolean}
   */
  meetsRequirements(requirements, encounter) {
    // TODO: implement other requirement types.
    for (let requirement of requirements) {
      for (let flag of (requirement.flags || [])) {
        if (flag.global) {
          if ((this._flags[flag.name] || false) != flag.value) {
            return false;
          }
        } else if (encounter) {
          if (encounter.getFlag(flag.name) != flag.value) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * @param {string} item_name
   */
  useItem(item_name) {
    const item = this._inventory.getItem(item_name);
    if (!item) {
      throw Error(`Player does not have item ${item_name}`);
    }
    if (item.equipment) {
      throw Error(`Cannot use equipment item ${item_name}`);
    }
    if (item.consume) {
      this._inventory.removeItem(item_name);
    }
    this._usedItem = item;
  }

  /**
   * @param {string} item_name
   */
  equipItem(item_name) {
    const item = this._inventory.getItem(item_name);
    if (!item) {
      throw Error(`Player does not have item ${item_name}`);
    }
    if (!item.equipment) {
      throw Error(`Cannot equip usable item ${item_name}`);
    }
    this._equippedItems[item.slot] = item;
  }

  resetUsedItems() {
    this._usedItem = null;
  }

  getInventory() {
    return this._inventory;
  }
}