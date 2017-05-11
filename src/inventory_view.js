import React from 'react';
import Inventory from './inventory';
import MainCharacter from './main_character';
import { ItemJson } from './json_types';

export default class InventoryView extends React.Component {
  /**
   * @param {{char: MainCharacter}} props
   */
  constructor(props) {
    super(props);
    const inventory = props.char.getInventory();
    inventory.addChangeListener(() => this.setState({
      inventory: inventory,
      hidden: this.state.hidden
    }));
    this.state = {
      inventory: inventory,
      hidden: true
    };
  }

  waitForUse() {
    this.setState({
      inventory: this.props.char.getInventory(),
      hidden: false
    });
    const usePromise = new Promise((resolve, reject) => {
      /** @type {function(string) : void} */
      this._resolveUse = (pickedItem) => {
        this.setState({
          inventory: this.props.char.getInventory(),
          hidden: true
        });
        resolve(pickedItem);
      }
    });
    return usePromise;
  }

  waitForEquip() {
    this.setState({
      inventory: this.props.char.getInventory(),
      hidden: false
    });
    const equipPromise = new Promise((resolve, reject) => {
      /** @type {function(string) : void} */
      this._resolveEquip = (pickedItem) => {
        this.setState({
          inventory: this.props.char.getInventory(),
          hidden: true
        });
        resolve(pickedItem);
      }
    });
    return equipPromise;
  }

  render() {
    return (<div className="inventory-view" hidden={this.state.hidden}>
      {this._getItems()}
    </div>)
  }

  _getItems() {
    /** @type {Inventory} */
    const inventory = this.props.char.getInventory();
    const items = [];
    for (let item of inventory.getItems()) {
      items.push(<div key={item.name} className="inventory-item">
        <span className="item-name">{item.title}</span>
        <span className="item-description">{item.description}</span>
        <button
          className="use-button"
          hidden={item.equipment}
          onClick={() => this._resolveUse(item.name)}>
          Use
        </button>
        <button
          className="equip-button"
          hidden={!item.equipment}
          onClick={() => this._resolveEquip(item.name)}>
          Equip
        </button>
      </div>);
    }
    return items;
  }
}