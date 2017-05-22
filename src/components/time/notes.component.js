import {React, Store} from 'electrum';
import E from 'electrum';
import {Note, Container, Label, Button, DragCab} from 'electrum-arc';
import * as ReducerNotes from './reducer-notes.js';
import {Unit} from 'electrum-theme';

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
      Glyphs:  [],
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
      const newNotes = ReducerNotes.reducer (notes,
        ReducerNotes.updateAction (props.field, value));
      bus.notify (this.props, source, newNotes);
      this.internalStore.select ('notes').set ('value', newNotes);
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

  onCreate () {
    const notes = this.internalStore.select ('notes').get ('value');
    const bus = this.props.bus || E.bus;

    const newNote = this.internalStore.select ('newNote').get ('value');
    const newNotes = ReducerNotes.reducer (notes,
      ReducerNotes.addAction (newNote));
    bus.notify (this.props, {type: 'change'}, newNotes);
    this.internalStore.select ('notes').set ('value', newNotes);
    this.extendedIndex = newNotes.length - 1;  // extend created note
    this.forceUpdate ();
  }

  onSwapExtended (index) {
    if (index === this.extendedIndex) {  // if panel extended ?
      index = -1;  // compact the panel
    }
    this.extendedIndex = index;
    this.forceUpdate ();
  }

  onDragEnding (selectedIds, toId) {
    // console.log (`Notes.onDragEnding ${selectedIds} ${toId} ${ownerId} ${ownerKind}`);
    const notes = this.internalStore.select ('notes').get ('value');
    const bus = this.props.bus || E.bus;

    const initialId = this.extendedIndex === -1 ? null : notes[this.extendedIndex].id;
    const newNotes = ReducerNotes.reducer (notes,
      ReducerNotes.dragAction (selectedIds[0], toId));
    bus.notify (this.props, {type: 'change'}, newNotes);
    this.internalStore.select ('notes').set ('value', newNotes);
    if (initialId) {
      for (let i = 0; i < newNotes.length; i++) {
        if (newNotes[i].id === initialId) {
          this.extendedIndex = i;
        }
      }
    }
    this.forceUpdate ();
  }

  renderHeader () {
    const style = this.mergeStyles ('header');
    return (
      <div style={style}>
        <Label
          text = 'Notes'
          grow = '1'
          kind = 'title'
          {...this.link ()} />
        <Button
          glyph          = 'plus'
          text           = 'Ajouter'
          glyph-position = 'right'
          on-click       = {this.onCreate}
          {...this.link ()} />
      </div>
    );
  }

  renderRow (note, extended, index) {
    const glyphs = this.read ('glyphs');
    const dhd = Unit.add (this.props.theme.shapes.lineHeight, this.props.theme.shapes.containerMargin);
    return (
      <DragCab
        drag-controller    = 'note'
        drag-height-detect = {dhd}
        direction          = 'vertical'
        color              = {this.props.theme.palette.dragAndDropHover}
        thickness          = {this.props.theme.shapes.dragAndDropTicketThickness}
        mode               = 'corner-top-left'
        drag-owner-id      = {note.id}
        do-click-action    = {() => this.onSwapExtended (index)}
        do-drag-ending     = {this.onDragEnding}
        {...this.link ()} >
        <Note
          index    = {index}
          field    = {index}
          value    = {note}
          glyphs   = {glyphs}
          extended = {extended ? 'true' : 'false'}
          {...this.linkNote ()} />
      </DragCab>
    );
  }

  renderRows () {
    const result = [];
    let index = 0;
    const notes = this.internalStore.select ('notes').get ('value');
    const extendedIndex = this.extendedIndex;
    for (var note of notes) {
      const extended = (extendedIndex === index);
      result.push (this.renderRow (note, extended, index++));
    }
    return result;
  }

  render () {
    const boxStyle = this.mergeStyles ('box');
    return (
      <div style={boxStyle}>
        {this.renderHeader ()}
        <Container
          kind            = 'column'
          drag-controller = 'note'
          drag-source     = 'notes'
          drag-owner-id   = 'notes'
          {...this.link ()} >
          {this.renderRows ()}
        </Container>
      </div>
    );
  }
}

/******************************************************************************/
