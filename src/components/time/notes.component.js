import {React, Store} from 'electrum';
import E from 'electrum';
import {Note} from 'electrum-arc';
import * as ReducerNotes from './reducer-notes.js';

/******************************************************************************/

export default class Notes extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify

    this.internalStore.select ('extendedIndex').set ('value', -1);
  }

  componentWillMount () {
    const notes = this.read ('value');
    this.internalStore.select ('notes').set ('value', notes);

    const newNote = {
      Content: '',
      Glyph:   '',
    };
    this.internalStore.select ('newNote').set ('value', newNote);
  }

  get extendedIndex () {
    return this.internalStore.select ('extendedIndex').get ('value');
  }

  set extendedIndex (value) {
    this.internalStore.select ('extendedIndex').set ('value', value);
  }

  // LocalBus.notify
  notify (props, source, value) {
    // console.log (`Notes.notify field=${props.field} type=${source.type}`);
    const notes = this.internalStore.select ('notes').get ('value');
    const bus = this.props.bus || E.bus;

    if (source.type === 'change') {
      if (props.field === -1) {  // last line (for create) ?
        this.internalStore.select ('newNote').set ('value', value);
      } else {
        const newNotes = ReducerNotes.reducer (notes,
          ReducerNotes.updateAction (props.field, value));
        bus.notify (this.props, source, newNotes);
        // console.dir (newNotes);
      }
    } else if (source.type === 'create') {
      const newNote = this.internalStore.select ('newNote').get ('value');
      const newNotes = ReducerNotes.reducer (Notes,
        ReducerNotes.addAction (newNote));
      bus.notify (this.props, {type: 'change'}, newNotes);
      this.internalStore.select ('notes').set ('value', newNotes);
      this.extendedIndex = newNotes.length - 1;  // extend created note
      this.forceUpdate ();
    } else if (source.type === 'delete') {
      const newNotes = ReducerNotes.reducer (notes,
        ReducerNotes.deleteAction (props.field));
      bus.notify (this.props, {type: 'change'}, newNotes);
      this.internalStore.select ('notes').set ('value', newNotes);
      this.extendedIndex = -1;  // collapse all notes
      this.forceUpdate ();
    }
  }

  linkNote () {
    return {...this.link (), bus: this.localBus};
  }

  onSwapExtended (index) {
    if (index === this.extendedIndex) {  // if panel extended ?
      index = -1;  // compact the panel
    }
    this.extendedIndex = index;
    this.forceUpdate ();
  }

  renderRow (note, create, extended, index) {
    return (
      <Note
        index            = {index}
        field            = {index}
        value            = {note}
        create           = {create   ? 'true' : 'false'}
        extended         = {extended ? 'true' : 'false'}
        do-swap-extended = {this.onSwapExtended}
        {...this.linkNote ()} />
    );
  }

  renderRows () {
    const result = [];
    let index = 0;
    const notes = this.internalStore.select ('notes').get ('value');
    const extendedIndex = this.extendedIndex;
    for (var note of notes) {
      const extended = (extendedIndex === index);
      result.push (this.renderRow (note, false, extended, index++));
    }
    return result;
  }

  renderEditor () {
    const newNote = this.internalStore.select ('newNote').get ('value');
    return this.renderRow (newNote, true, false, -1);  // last line (for create)
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
