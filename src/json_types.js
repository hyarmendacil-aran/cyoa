// @fileOverview These types are just for the benefit of the type checker, and are not actually 
// used.  The real values are ingested from game.json and validated against the schema, which
// should match these type definitions.

export class ItemJson {
  constructor() {
    this.name = '';
    this.title = '';
    this.description = '';
    this.equipment = false;
    this.consume = false;
    this.slot = '';
  }
}

export class FlagJson {
  constructor() {
    this.name = '';
    this.global = false;
    this.value = false;
  }
}

export class RequirementsJson {
  constructor() {
    /** @type {Array<{name: string, value: number}>} */
    this.stats = [];
    /** @type {string} */
    this.item = '';
    /** @type {Array<string>} */
    this.equipment = [];
    /** @type {Array<FlagJson>} */
    this.flags = [];
  }
}

export class EffectsJson {
  constructor() {
    /** @type {Array<{name: string, add: number}>} */
    this.changeStats = [];
    /** @type {Array<FlagJson>} */
    this.setFlags = [];
    /** @type {Array<string>} */
    this.giveItems = [];
    /** @type {Array<string>} */
    this.takeItems = [];
  }
}

export class ActionJson {
  constructor() {
    this.name = '';
    this.title = '';
    this.description = '';
    /** @type {Array<EffectsJson>} */
    this.effects = [];
  }
}

export class StateJson {
  constructor() {
    this.description = '';
    /** @type {Array<RequirementsJson>} */
    this.requirements = [];
    /** @type {Array<ActionJson>} */
    this.actions = [];
    /** @type {Array<EffectsJson>} */
    this.effects = [];
  }
}

export class EncounterJson {
  constructor() {
    this.turns = 0;
    this.chance = 0;
    /** @type {Array<RequirementsJson>} */
    this.requirements = [];
    /** @type {Array<EffectsJson>} */
    this.failureEffects = [];
    /** @type {Array<RequirementsJson>} */
    this.successRequirements = [];
    /** @type {Array<EffectsJson>} */
    this.successEffects = [];
    /** @type {Array<StateJson>} */
    this.states = [];
    this.failureDescription = '';
    this.successDescription = '';
  }
}

export class AreaJson {
  constructor() {
    this.title = '';
    this.description = '';
    /** @type {Array<EncounterJson>} */
    this.encounters = [];
  }
}

export class GameJson {
  constructor() {
    /** @type {Array<{name: string, title: string, startingValue: number, visible: boolean}>} */
    this.stats = [];
    /** @type {Array<ItemJson>} */
    this.items = [];
    /** @type {Array<AreaJson>} */
    this.areas = [];
  }
}