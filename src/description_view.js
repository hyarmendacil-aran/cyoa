import React from 'react';
import Area from './area';

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
      {this._getDescription()}
    </div>)
  }

  _getDescription() {
    const encounter = this.props.area.getCurrentEncounter();
    if (encounter) {
      return encounter.getDescription();
    } else {
      return this.props.area.getDescription();
    }
  }
}