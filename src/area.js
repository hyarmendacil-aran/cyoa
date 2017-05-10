import Encounter from './encounter';
import Listenable from './listenable';
import MainCharacter from './main_character';
import { AreaJson } from './json_types';

export default class Area extends Listenable {
  /**
   * @param {AreaJson} areaJson
   * @param {MainCharacter} char
   */
  constructor(areaJson, char) {
    super();
    this._areaJson = areaJson;
    this._char = char;
    this._encounter = null;
  }

  getTitle() {
    return this._areaJson.title;
  }

  getDescription() {
    return this._areaJson.description;
  }

  explore() {
    this._encounter = null;
    let totalChance = 0.0;
    for (let encounter of this._areaJson.encounters) {
      if (!this._char.meetsRequirements(encounter.requirements, null)) {
        continue;
      }
      totalChance += encounter.chance;
    }

    let roll = Math.random() * totalChance;
    totalChance = 0.0;
    for (let encounter of this._areaJson.encounters) {
      if (!this._char.meetsRequirements(encounter.requirements, null)) {
        continue;
      }
      if (totalChance + encounter.chance > roll) {
        this._encounter = new Encounter(encounter, this._char);
        this._encounter.addChangeListener(() => this._notifyChange());
        this._notifyChange();
        break;
      } else {
        totalChance += encounter.chance;
      }
    }
    if (!this._encounter) {
      throw new Error('No encounter selected!');
    }
  }

  getCurrentEncounter() {
    return this._encounter;
  }
}