import {React, Store} from 'electrum';
import E from 'electrum';
import {Recurrence} from 'electrum-arc';
import * as ReducerRecurrences from './reducer-recurrences.js';

/******************************************************************************/

export default class Recurrences extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify

    this.internalStore.select ('extendedIndex').set ('value', -1);
  }

  componentWillMount () {
    const recurrences = this.read ('value');
    this.internalStore.select ('recurrences').set ('value', recurrences);

    const newRecurrence = {
      Cron:   '0 0 0 * * *',
      Add:    [],
      Delete: [],
    };
    this.internalStore.select ('newRecurrence').set ('value', newRecurrence);
  }

  get extendedIndex () {
    return this.internalStore.select ('extendedIndex').get ('value');
  }

  set extendedIndex (value) {
    this.internalStore.select ('extendedIndex').set ('value', value);
  }

  // LocalBus.notify
  notify (props, source, value) {
    // console.log (`Recurrences.notify field=${props.field} type=${source.type}`);
    if (source.type === 'change') {
      if (props.field === -1) {  // last line (for create) ?
        this.internalStore.select ('newRecurrence').set ('value', value);
      } else {
        const recurrences = this.internalStore.select ('recurrences').get ('value');
        const newRecurrences = ReducerRecurrences.reducer (recurrences, {
          type:       'UPDATE',
          index:      props.field,
          recurrence: value
        });
        const bus = this.props.bus || E.bus;
        bus.notify (this.props, source, newRecurrences);
        // console.dir (newRecurrences);
      }
    }
  }

  linkRecurrence () {
    return {...this.link (), bus: this.localBus};
  }

  onSwapExtended (index) {
    if (index === this.extendedIndex) {  // if panel extended ?
      index = -1;  // compact the panel
    }
    this.extendedIndex = index;
    this.forceUpdate ();
  }

  onCreateRecurrence () {
    const recurrences = this.internalStore.select ('recurrences').get ('value');
    const newRecurrence = this.internalStore.select ('newRecurrence').get ('value');
    const newRecurrences = ReducerRecurrences.reducer (recurrences, {type: 'ADD', recurrence: newRecurrence});
    const bus = this.props.bus || E.bus;
    bus.notify (this.props, {type: 'change'}, newRecurrences);
    this.internalStore.select ('recurrences').set ('value', newRecurrences);
    this.extendedIndex = newRecurrences.length - 1;  // extend created recurrence
    this.forceUpdate ();
  }

  onDeleteRecurrence (field) {
    const recurrences = this.internalStore.select ('recurrences').get ('value');
    const newRecurrences = ReducerRecurrences.reducer (recurrences, {type: 'DELETE', index: field});
    const bus = this.props.bus || E.bus;
    bus.notify (this.props, {type: 'change'}, newRecurrences);
    this.internalStore.select ('recurrences').set ('value', newRecurrences);
    this.extendedIndex = -1;  // collapse all recurrences
    this.forceUpdate ();
  }

  renderRow (recurrence, create, extended, index) {
    return (
      <Recurrence
        index            = {index}
        field            = {index}
        value            = {recurrence}
        create           = {create   ? 'true' : 'false'}
        extended         = {extended ? 'true' : 'false'}
        do-swap-extended = {this.onSwapExtended}
        do-create        = {this.onCreateRecurrence}
        do-delete        = {this.onDeleteRecurrence}
        {...this.linkRecurrence ()} />
    );
  }

  renderRows () {
    const result = [];
    let index = 0;
    const recurrences = this.internalStore.select ('recurrences').get ('value');
    const extendedIndex = this.extendedIndex;
    for (var recurrence of recurrences) {
      const extended = (extendedIndex === index);
      result.push (this.renderRow (recurrence, false, extended, index++));
    }
    return result;
  }

  renderEditor () {
    const newRecurrence = this.internalStore.select ('newRecurrence').get ('value');
    return this.renderRow (newRecurrence, true, false, -1);  // last line (for create)
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
