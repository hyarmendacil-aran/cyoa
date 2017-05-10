import React from 'react';
import ReactDOM from 'react-dom';
import jsonschema from 'jsonschema';
import XMLHttpRequestPromise from 'xhr-promise';

import AppLayout from './app_layout';
import Area from './area';
import MainCharacter from './main_character';
import { GameJson } from './json_types';

const xhr = new XMLHttpRequestPromise();

let gameData = null;
let gameDataSchema = null;

xhr.send({
  method: 'GET',
  url: 'data/game.json',
})
  .then((results) => {
    if (results.status !== 200) {
      throw new Error('request failed');
    }
    gameData = results.responseText;
    return xhr.send({
      method: 'GET',
      url: 'data/game_schema.json',
    })
  }).then((results) => {
    gameDataSchema = results.responseText;

    const validate = jsonschema.validate;
    const validatorResult = validate(gameData, gameDataSchema);
    if (validatorResult.errors.length > 0) {
      throw Error(validatorResult.errors.toString());
    }
    /** @type {GameJson} */
    const parsedData = validatorResult.instance;
    console.log(parsedData);

    const char = new MainCharacter('Hiro Protagonist', parsedData.items);
    for (let stat of parsedData.stats) {
      char.defineStat(stat.name, stat.startingValue, stat.title, stat.visible);
    }

    const area = new Area(parsedData.areas[0], char);

    ReactDOM.render(
      <AppLayout char={char} area={area}></AppLayout>,
      document.getElementById('app'));
  });