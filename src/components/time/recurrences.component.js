import {React} from 'electrum';
import {Recurrence} from 'electrum-arc';

/******************************************************************************/

export default class Recurrences extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      extendedIndex: -1,
    };
    this.recurrencesData = this.read ('recurrences');
  }

  getExtendedIndex () {
    return this.state.extendedIndex;
  }

  setExtendedIndex (value) {
    this.setState ( {
      extendedIndex: value
    });
  }

  createRecurrence (recurrence) {
    console.log ('Recurrences.createRecurrence');
    console.dir (recurrence);
    this.recurrencesData.push (recurrence);
    this.setExtendedIndex (this.recurrencesData.length - 1);
    this.forceUpdate ();
  }

  deleteRecurrence (index) {
    console.log (index);
    this.recurrencesData.splice (index, 1);
    this.forceUpdate ();
  }

  renderRow (recurrence, create, extended, index) {
    return (
      <Recurrence
        recurrence = {recurrence}
        index      = {index}
        create     = {create   ? 'true' : 'false'}
        extended   = {extended ? 'true' : 'false'}
        do-create  = {x => this.createRecurrence (x)}
        do-delete  = {x => this.deleteRecurrence (x)}
        {...this.link ()} />
    );
  }

  renderRows () {
    const result = [];
    let index = 0;
    const extendedIndex = this.getExtendedIndex ();
    for (var recurrence of this.recurrencesData) {
      const extended = (extendedIndex === index);
      result.push (this.renderRow (recurrence, false, extended, index++));
    }
    return result;
  }

  renderEditor () {
    const recurrence = {};
    return this.renderRow (recurrence, true, false, -1);
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
