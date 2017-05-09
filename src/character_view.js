import React from 'react';
import MainCharacter from './main_character';

export default class CharacterView extends React.Component {
  /**
   * @param {{char: MainCharacter}} props
   */
  constructor(props) {
    super(props);
    const char = props.char;
    char.addChangeListener(() => this.setState(char));
    this.state = char;
  }

  render() {
    const stats = this._renderStats();
    return (<div className="character-view">
      <h3>{this.props.char.name}</h3>
      {stats}
    </div>)
  }

  _renderStats() {
    const stats = []
    for (let stat in this.props.char.listStats()) {
      stats.push(<div className="stat" key={stat}><dt>{stat}</dt> <dd>{this.props.char.getStat(stat)}</dd></div>);
    }
    return stats;
  }
}