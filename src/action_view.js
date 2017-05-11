import React from 'react';
import Area from './area';
import InventoryView from './inventory_view';
import MainCharacter from './main_character';

export default class ActionView extends React.Component {
  /**
   * @param {{area: Area, char: MainCharacter}} props
   */
  constructor(props) {
    super(props);
    /** @type {InventoryView} */
    this._inventoryView;

    const area = props.area;
    area.addChangeListener(() => this.setState(area));
    this.state = area;

    this._explore = this._explore.bind(this);
    this._performAction = this._performAction.bind(this);
  }

  render() {
    return (<div className="action-view">
      {this._getActions()}
      <InventoryView
        hidden
        char={this.props.char}
        ref={(view) => {
          /** @type {InventoryView} */
          const typedView = view;
          this._inventoryView = typedView;
        }}>
      </InventoryView>
    </div>)
  }

  _getActions() {
    /** @type {Area} */
    const area = this.props.area;
    const encounter = area.getCurrentEncounter();
    if (encounter && !encounter.finished()) {
      const actions = encounter.getActions().concat([
        { name: '_item', title: 'Use an item', description: '', effects: [] },
        { name: '_equip', title: 'Equip an item', description: '', effects: [] }
      ]);
      const actionDom = actions.map((action) => (
        <button key={action.name} onClick={() => this._performAction(action.name)}>{action.title}</button>
      ));
      return (<div className="action-view-actions">
        {actionDom}
      </div>)
    } else {
      return (<div className="action-view-actions">
        <button onClick={this._explore}>Explore</button>
      </div>)
    }
  }

  _explore() {
    this.props.area.explore();
  }

  /**
   * @param {string} action
   */
  _performAction(action) {
    /** @type {Area} */
    const area = this.props.area;
    if (action == '_item') {
      // Allow the player to choose which item to use.
      this._inventoryView.waitForUse().then((itemName) => {
        area.getCurrentEncounter().takeTurn(this.props.char, action, itemName);
      });
    } else if (action == '_equip') {
      // Allow the player to choose which item to equip.
      this._inventoryView.waitForEquip().then((itemName) => {
        area.getCurrentEncounter().takeTurn(this.props.char, action, itemName);
      });
    } else {
      area.getCurrentEncounter().takeTurn(this.props.char, action);
    }
  }
}