import React from 'react';
import Area from './area';
import Encounter from './encounter';

export default class DescriptionView extends React.Component {
  /**
   * @param {{area: Area}} props
   */
  constructor(props) {
    super(props);
    props.area.addChangeListener(() => this.setState({
      area: props.area,
      encounter: props.area.getCurrentEncounter()
    }));
    this._getDescription = this._getDescription.bind(this);
    this.state = {
      area: props.area,
      encounter: props.area.getCurrentEncounter()
    };
  }

  render() {
    return (<div className="description-view">
      <div className="action-description">{this._getActionDescription()}</div>
      <div className="description">{this._getDescription()}</div>
      <div className="effect-description">{this._getEffectDescription()}</div>
    </div>)
  }

  _getActionDescription() {
    /** @type {Encounter} */
    const encounter = this.props.area.getCurrentEncounter();
    if (encounter) {
      return encounter.getActionDescription();
    } else {
      return '';
    }
  }

  _getDescription() {
    /** @type {Encounter} */
    const encounter = this.props.area.getCurrentEncounter();
    if (encounter) {
      return encounter.getDescription();
    } else {
      return this.props.area.getDescription();
    }
  }

  _getEffectDescription() {
    /** @type {Encounter} */
    const encounter = this.props.area.getCurrentEncounter();
    if (encounter) {
      return encounter.getEffectsDescription();
    }
    return '';
  }
}