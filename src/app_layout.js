import React from 'react';
import ActionView from './action_view';
import CharacterView from './character_view';
import DescriptionView from './description_view';
import Area from './area';
import MainCharacter from './main_character';

export default class AppLayout extends React.Component {
  /**
   * @param {{char: MainCharacter, area: Area}} props
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (<div className="app-layout">
      <div className="app-layout-top">
        <CharacterView char={this.props.char}></CharacterView>
        <DescriptionView area={this.props.area}></DescriptionView>
      </div>
      <ActionView area={this.props.area} char={this.props.char}></ActionView>
    </div>)
  }
}