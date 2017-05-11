import Listenable from './listenable';
import MainCharacter from './main_character';
import { EffectsJson, EncounterJson, FlagJson } from './json_types';

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
    this._actionDescription = '';
    this._effectsDescription = '';
    this.takeTurn(char, '_wait');
  }

  /**
   * @param {MainCharacter} char
   * @param {string} selectedAction
   * @param {string} [detail]
   */
  takeTurn(char, selectedAction, detail) {
    this._actionDescription = '';
    this._effectsDescription = '';
    if (selectedAction == '_wait') {
      // Do nothing, just select the best state for the current situation.
    } else if (selectedAction == '_item') {
      this._actionDescription = `You use ${char.getInventory().getItem(detail).title}.\n\n`;
      char.useItem(detail);
    } else if (selectedAction == '_equip') {
      this._actionDescription = `You equip ${char.getInventory().getItem(detail).title}.\n\n`;
      char.equipItem(detail);
    } else {
      this._actionDescription = this._getAction(selectedAction).description;
      char.applyEffects(this._getAction(selectedAction).effects || [], this);
      this._actionDescription +=
        this._describeEffects(this._getAction(selectedAction).effects, char);
    }

    // Check for failure first, then success, then state changes.
    if (this._json.turns > 0 && this._turnsElapsed >= this._json.turns) {
      this._failed = true;
      char.applyEffects(this._json.failureEffects || [], this);
      this._effectsDescription += this._describeEffects(this._json.failureEffects, char);
    } else if (char.meetsRequirements(this._json.successRequirements, this)) {
      this._succeeded = true;
      char.applyEffects(this._json.successEffects || [], this);
      this._effectsDescription += this._describeEffects(this._json.successEffects, char);
    } else {
      const reversedStates = this._json.states.slice();
      reversedStates.reverse();  // Check later states first.
      for (let state of reversedStates) {
        if (char.meetsRequirements(state.requirements, this)) {
          this._currentState = state;
          char.applyEffects(state.effects || [], this);
          this._effectsDescription += this._describeEffects(state.effects, char);
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

  getActionDescription() {
    return this._actionDescription;
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

  getEffectsDescription() {
    return this._effectsDescription;
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

  /**
   * @param {Array<EffectsJson>} effects
   * @param {MainCharacter} char
   */
  _describeEffects(effects, char) {
    let description = ' ';
    for (let effect of effects) {
      for (let changeStat of (effect.changeStats || [])) {
        const amount = changeStat.add;
        const name = changeStat.name;
        description += `You ${amount > 0 ? 'gain' : 'lose'} ${Math.abs(amount)} ${name}. `;
      }
      for (let item of (effect.takeItems || [])) {
        description += `You lose ${char.getInventory().getItem(item).title}. `;
      }
      for (let item of (effect.giveItems || [])) {
        description += `You obtain ${char.getInventory().getItem(item).title}! `;
      }
    }
    return description;
  }
}