import React from 'react';
import ReactDOM from 'react-dom';
import AppLayout from './app_layout';
import Area from './area';
import MainCharacter from './main_character';

const XMLHttpRequestPromise = require('xhr-promise');

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

    const validate = require('jsonschema').validate;
    const validatorResult = validate(gameData, gameDataSchema);
    if (validatorResult.errors.length > 0) {
      throw Error(validatorResult.errors);
    }
    const parsedData = validatorResult.instance;
    console.log(parsedData);

    const char = new MainCharacter('Hiro Protagonist');
    for (let stat of parsedData.stats) {
      char.defineStat(stat.name, stat.startingValue, stat.title, stat.visible);
    }

    const area = new Area(parsedData.areas[0], char);

    ReactDOM.render(
      <AppLayout char={char} area={area}></AppLayout>,
      document.getElementById('app'));
  });