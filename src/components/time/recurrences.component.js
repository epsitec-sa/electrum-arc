import {React} from 'electrum';
import {Recurrence} from 'electrum-arc';

/******************************************************************************/

export default class Recurrences extends React.Component {

  constructor (props) {
    super (props);
    this.recurrencesData = this.read ('recurrences');
  }

  createRecurrence (recurrence) {
    console.dir (recurrence);
    this.recurrencesData.push (recurrence);
    this.forceUpdate ();
  }

  deleteRecurrence (index) {
    console.log (index);
    this.recurrencesData.splice (index, 1);
    this.forceUpdate ();
  }

  renderRow (recurrence, create, index) {
    return (
      <Recurrence
        recurrence = {recurrence}
        index      = {index}
        create     = {create ? 'true' : 'false'}
        do-create  = {x => this.createRecurrence (x)}
        do-delete  = {x => this.deleteRecurrence (x)}
        {...this.link ()} />
    );
  }

  renderRows () {
    const result = [];
    let index = 0;
    for (var recurrence of this.recurrencesData) {
      result.push (this.renderRow (recurrence, false, index++));
    }
    return result;
  }

  renderEditor () {
    const recurrence = {};
    return this.renderRow (recurrence, true, -1);
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
