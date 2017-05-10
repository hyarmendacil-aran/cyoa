import Listenable from './listenable';
import MainCharacter from './main_character';
import { EncounterJson, FlagJson } from './json_types';

export default class Encounter extends Listenable {
  /**
   * @param {EncounterJson} encounterJson;
   * @param {MainCharacter} char;
   */
  constructor(encounterJson, char) {
    super();
    this._json = encounterJson;
    /** @type Object<FlagJson> */
    this._flags = {};
    this._succeeded = false;
    this._failed = false;
    this._turnsElapsed = 0;
    this.takeTurn(char, '_wait');
  }

  /**
   * @param {MainCharacter} char
   * @param {string} selectedAction
   * @param {string} [detail]
   */
  takeTurn(char, selectedAction, detail) {
    if (selectedAction == '_wait') {
      // Do nothing, just select the best state for the current situation.
    } else if (selectedAction == '_item') {
      char.useItem(detail);
    } else if (selectedAction == '_equip') {
      char.equipItem(detail);
    } else {
      char.applyEffects(this._getAction(selectedAction).effects || [], this);
    }

    // Check for failure first, then success, then state changes.
    if (this._turnsElapsed >= this._json.turns) {
      this._failed = true;
      char.applyEffects(this._json.failureEffects || [], this);
    } else if (char.meetsRequirements(this._json.successRequirements, this)) {
      this._succeeded = true;
      char.applyEffects(this._json.successEffects || [], this);
    } else {
      const reversedStates = this._json.states.slice();
      reversedStates.reverse();  // Check later states first.
      for (let state of reversedStates) {
        if (char.meetsRequirements(state.requirements, this)) {
          this._currentState = state;
          break;
        }
      }
      if (!this._currentState) {
        throw Error("No state in the encounter had requirements that could be met.");
      }
    }

    // Used items only have an effect during the turn they're used.
    char.resetUsedItems();

    ++this._turnsElapsed;
    this._notifyChange();
  }

  getDescription() {
    if (this._failed) {
      return this._json.failureDescription;
    } else if (this._succeeded) {
      return this._json.successDescription;
    } else {
      return this._currentState.description;
    }
  }

  getActions() {
    return this._currentState.actions;
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  getFlag(name) {
    return this._flags[name] || false;
  }

  /**
   * @param {string} name
   * @param {boolean} value
   */
  setFlag(name, value) {
    this._flags[name] = value;
  }

  finished() {
    return this._succeeded || this._failed;
  }

  _getAction(name) {
    for (let action of this._currentState.actions) {
      if (action.name == name) {
        return action;
      }
    }
    return null;
  }
}