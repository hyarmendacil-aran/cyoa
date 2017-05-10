import React from 'react';
import Inventory from './inventory';
import MainCharacter from './main_character';
import { ItemJson } from './json_types';

export default class InventoryView extends React.Component {
  /**
   * @param {{inventory: Inventory, char: MainCharacter}} props
   */
  constructor(props) {
    super(props);
    props.inventory.addChangeListener(() => this.setState({
      inventory: props.inventory,
    }));
    this.state = {
      inventory: props.inventory
    };
    this._select = this._select.bind(this);
  }

  render() {
    return (<div className="inventory-view">
      {this._getItems()}
    </div>)
  }

  _getItems() {
    /** @type {Inventory} */
    const inventory = this.props.getInventory();
    const items = [];
    for (let item of inventory.getItems()) {
      items.push(<div className="inventory-item">
        <span className="item-name">{item.title}</span>
        <span className="item-description">{item.description}</span>
        <button
          className="use-button"
          hidden={item.equipment}
          onClick={() => this.props.char.useItem(item)}>
          Use
        </button>
        <button
          className="equip-button"
          hidden={!item.equipment}
          onClick={() => this.props.char.equipItem(item)}>
          Equip
        </button>
      </div>);
    }
    return items;
  }
}