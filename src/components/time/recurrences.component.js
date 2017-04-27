/* global window */

import {React} from 'electrum';
import {Recurrence} from 'electrum-arc';

/******************************************************************************/

function clone (recurrence) {
  return JSON.parse (JSON.stringify (recurrence));
}

/******************************************************************************/

export default class Recurrences extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      extendedIndex: -1,
    };
    this.newRecurrence = {
      Cron:   '0 0 0 * * *',
      Add:    [],
      Delete: [],
    };
  }

  get extendedIndex () {
    return this.state.extendedIndex;
  }

  set extendedIndex (value) {
    this.setState ( {
      extendedIndex: value
    });
  }

  updateComponents () {
    // TODO: Shit code to replace by correct code !!!
  }

  swapExtended (index) {
    if (index === this.extendedIndex) {  // if panel extended ?
      index = -1;  // compact the panel
    }
    this.extendedIndex = index;
  }

  createRecurrence (recurrence) {
    this.recurrencesData.push (clone (recurrence));  // add to end of list
    this.extendedIndex = this.recurrencesData.length - 1;  // extend last panel
  }

  deleteRecurrence (index) {
    this.recurrencesData.splice (index, 1);
    this.extendedIndex = -1;
    this.updateComponents ();
  }

  eraseEvents (index) {
    this.recurrencesData[index].Add = [];
    this.recurrencesData[index].Delete = [];
    this.updateComponents ();
  }

  renderRow (key, create, extended, index) {
    return (
      <Recurrence
        index            = {index}
        create           = {create   ? 'true' : 'false'}
        extended         = {extended ? 'true' : 'false'}
        do-swap-extended = {x => this.swapExtended (x)}
        do-create        = {x => this.createRecurrence (x)}
        do-delete        = {x => this.deleteRecurrence (x)}
        do-erase-events  = {x => this.eraseEvents (x)}
        {...this.link (key)} />
    );
  }

  renderRows () {
    const result = [];
    let index = 0;
    const extendedIndex = this.extendedIndex;
    for (var key of this.props.state.indexKeys) {
      const extended = (extendedIndex === index);
      result.push (this.renderRow (key, false, extended, index++));
    }
    return result;
  }

  renderEditor () {
    // ???return this.renderRow (this.newRecurrence, true, false, -1);
    return null;
  }

  render () {
    const boxStyle = this.mergeStyles ('box');
    return (
      <div style={boxStyle}>
        {this.renderRows ()}
        {this.renderEditor ()}
      </div>
    );
  }
}

/******************************************************************************/
