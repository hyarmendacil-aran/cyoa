import React from 'react';
import Area from './area';

export default class ActionView extends React.Component {
  /**
   * @param {{area: Area}} props
   */
  constructor(props) {
    super(props);
    const area = props.area;
    area.addChangeListener(() => this.setState(area));
    this.state = area;
    this._explore = this._explore.bind(this);
    this._performAction = this._performAction.bind(this);
  }

  render() {
    return (<div className="action-view">
      {this._getActions()}
    </div>)
  }

  _getActions() {
    /** @type {Area} */
    const area = this.props.area;
    const encounter = area.getCurrentEncounter();
    if (encounter && !encounter.finished()) {
      const actions = encounter.getActions().concat([
        { name: '_item', description: 'Use an item', effects: [] },
        { name: '_equip', description: 'Put on an outfit', effects: [] }
      ]);
      const actionDom = actions.map((action) => (
        <button key={action.name} onClick={() => this._performAction(action.name)}>{action.description}</button>
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
    area.getCurrentEncounter().takeTurn(this.props.char, action);
  }
}