import {React, Store} from 'electrum';
import E from 'electrum';
import {Recurrence, Container, Label, Button, DragCab} from 'electrum-arc';
import * as ReducerRecurrences from './reducer-recurrences.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Recurrences extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify

    this.internalStore.select ('extendedIndex').set ('value', -1);
  }

  componentWillMount () {
    const data = this.read ('value');
    this.recurrencesId = data.id;
    this.internalStore.select ('recurrences').set ('value', data.recurrences);

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
    const recurrences = this.internalStore.select ('recurrences').get ('value');
    const bus = this.props.bus || E.bus;

    if (source.type === 'change') {
      const newRecurrences = ReducerRecurrences.reducer (recurrences,
        ReducerRecurrences.updateAction (props.field, value));
      bus.notify (this.props, source, newRecurrences);
      this.internalStore.select ('recurrences').set ('value', newRecurrences);
    } else if (source.type === 'delete') {
      const newRecurrences = ReducerRecurrences.reducer (recurrences,
        ReducerRecurrences.deleteAction (props.field));
      bus.notify (this.props, {type: 'change'}, newRecurrences);
      this.internalStore.select ('recurrences').set ('value', newRecurrences);
      this.extendedIndex = -1;  // collapse all recurrences
      this.forceUpdate ();
    }
  }

  linkRecurrence () {
    return {...this.link (), bus: this.localBus};
  }

  onCreate () {
    const recurrences = this.internalStore.select ('recurrences').get ('value');
    const bus = this.props.bus || E.bus;

    const newRecurrence = this.internalStore.select ('newRecurrence').get ('value');
    const newRecurrences = ReducerRecurrences.reducer (recurrences,
      ReducerRecurrences.addAction (newRecurrence));
    bus.notify (this.props, {type: 'change'}, newRecurrences);
    this.internalStore.select ('recurrences').set ('value', newRecurrences);
    this.extendedIndex = newRecurrences.length - 1;  // extend created recurrence
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
    // console.log (`Recurrences.onDragEnding ${selectedIds} ${toId} ${ownerId} ${ownerKind}`);
    const recurrences = this.internalStore.select ('recurrences').get ('value');
    const bus = this.props.bus || E.bus;

    const initialId = this.extendedIndex === -1 ? null : recurrences[this.extendedIndex].id;
    const newRecurrences = ReducerRecurrences.reducer (recurrences,
      ReducerRecurrences.dragAction (selectedIds[0], toId));
    bus.notify (this.props, {type: 'change'}, newRecurrences);
    this.internalStore.select ('recurrences').set ('value', newRecurrences);
    if (initialId) {
      for (let i = 0; i < newRecurrences.length; i++) {
        if (newRecurrences[i].id === initialId) {
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
          text = 'Récurrences'
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

  renderRow (recurrence, extended, index) {
    const dhd = Unit.add (this.props.theme.shapes.lineHeight, this.props.theme.shapes.containerMargin);
    return (
      <DragCab
        drag-controller    = 'recurrence'
        drag-height-detect = {dhd}
        direction          = 'vertical'
        color              = {this.props.theme.palette.dragAndDropHover}
        thickness          = {this.props.theme.shapes.dragAndDropTicketThickness}
        mode               = 'corner-top-left'
        drag-owner-id      = {recurrence.id}
        do-click-action    = {() => this.onSwapExtended (index)}
        do-drag-ending     = {this.onDragEnding}
        {...this.link ()} >
        <Recurrence
          index    = {index}
          field    = {index}
          value    = {recurrence}
          extended = {extended ? 'true' : 'false'}
          {...this.linkRecurrence ()} />
      </DragCab>
    );
  }

  renderRows () {
    const result = [];
    let index = 0;
    const recurrences = this.internalStore.select ('recurrences').get ('value');
    const extendedIndex = this.extendedIndex;
    for (var recurrence of recurrences) {
      const extended = (extendedIndex === index);
      result.push (this.renderRow (recurrence, extended, index++));
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
          drag-controller = 'recurrence'
          drag-source     = 'recurrences'
          drag-owner-id   = {this.recurrencesId}
          {...this.link ()} >
          {this.renderRows ()}
        </Container>
      </div>
    );
  }
}

/******************************************************************************/
