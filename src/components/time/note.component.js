import {React, Store} from 'electrum';
import {ReactDOM} from 'electrum';
import {LabelTextField, Button, Label, GlyphsDialog, DragCab} from 'electrum-arc';
import * as GlyphHelpers from '../polypheme/glyph-helpers.js';
import * as ReducerGlyphs from './reducer-glyphs.js';
import * as ComboHelpers from '../combo/combo-helpers.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Note extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify

    this.showGlyphsDialog = false;
  }

  // LocalBus.notify
  notify (props, source, value) {
    // console.log (`Note.notify field=${props.field} type=${source.type}`);
    if (source.type === 'change') {
      this.internalStore.select (props.field).set ('value', value);
      this.notifyParent ('change');
      this.updateInfo ();
      this.forceUpdate ();
    }
  }

  notifyParent (type) {
    const source = {type: type};
    this.props.bus.notify (this.props, source, this.getValueState ());
  }

  getValueState () {
    const content = this.internalStore.select ('Content').get ('value');
    const glyphs  = this.internalStore.select ('Glyphs' ).get ('value');

    return {
      id:      this.noteId,
      Content: content,
      Glyphs:  glyphs,
    };
  }

  linkContent () {
    return {...this.link (), state: this.internalStore.select ('Content'), bus: this.localBus};
  }

  linkGlyphs () {
    return {...this.link (), state: this.internalStore.select ('Glyphs'), bus: this.localBus};
  }

  updateComponent () {
    const note = this.read ('value');
    if (note !== this.lastNote) {
      this.updateInternalState (note);
      this.lastNote = note;
      this.updateInfo ();
    }
  }

  updateInternalState (note) {
    const content = note.Content;
    const glyphs  = note.Glyphs;

    this.noteId = note.id;

    this.internalStore.select ('Content').set ('value', content);
    this.internalStore.select ('Glyphs' ).set ('value', glyphs);
  }

  updateInfo () {
    this.content = this.internalStore.select ('Content').get ('value');
    this.glyphs  = this.internalStore.select ('Glyphs' ).get ('value');
  }

  onDeleteNote () {
    this.notifyParent ('delete');
    this.updateInfo ();
    this.forceUpdate ();
  }

  onSwapExtended () {
    const x = this.read ('do-swap-extended');
    if (x) {
      const index = this.read ('index');
      x (index);
    }
  }

  onGlyphClicked (glyph) {
    const newGlyphs = ReducerGlyphs.reducer (this.glyphs,
      ReducerGlyphs.toggleAction (glyph));
    this.internalStore.select ('Glyphs').set ('value', newGlyphs);
    this.notifyParent ('change');
    this.updateInfo ();
    this.forceUpdate ();
  }

  onClearGlyphs () {
    const newGlyphs = ReducerGlyphs.reducer (this.glyphs,
      ReducerGlyphs.flushAction ());
    this.internalStore.select ('Glyphs').set ('value', newGlyphs);
    this.notifyParent ('change');
    this.updateInfo ();
    this.forceUpdate ();
  }

  onGlyphDragged (selectedId, toId) {
    const newGlyphs = ReducerGlyphs.reducer (this.glyphs,
      ReducerGlyphs.dragAction (selectedId, toId));
    this.internalStore.select ('Glyphs').set ('value', newGlyphs);
    this.notifyParent ('change');
    this.updateInfo ();
    this.forceUpdate ();
  }

  onOpenGlyphsDialog () {
    this.showGlyphsDialog = true;
    const node = ReactDOM.findDOMNode (this.glyphDialogButton);
    this.comboLocation = ComboHelpers.getComboLocation (node, this.props.theme, 'flying-dialog');
    this.forceUpdate ();
  }

  onCloseGlyphsDialog () {
    this.showGlyphsDialog = false;
    this.forceUpdate ();
  }

  onClickAction (e) {
  }

  onDragEnding (selectedIds, toId, ownerId, ownerKind) {
  }

  renderGlyphsDialog () {
    if (this.showGlyphsDialog) {
      const allGlyphs = this.read ('glyphs');
      return (
        <GlyphsDialog
          center          = {this.comboLocation.center}
          top             = {this.comboLocation.top}
          bottom          = {this.comboLocation.bottom}
          all-glyphs      = {allGlyphs}
          selected-glyphs = {this.glyphs}
          glyph-clicked   = {this.onGlyphClicked}
          clear-glyphs    = {this.onClearGlyphs}
          glyph-dragged   = {this.onGlyphDragged}
          close-dialog    = {this.onCloseGlyphsDialog}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderInfoGlyph (glyph, index) {
    const g = GlyphHelpers.getGlyph (glyph.Glyph);
    return (
      <Label
        index       = {index}
        width       = '28px'
        glyph       = {g.glyph}
        glyph-color = {g.color}
        glyph-size  = '150%'
        spacing     = 'compact'
        justify     = 'center'
        {...this.link ()} />
    );
  }

  renderInfoGlyphs (glyphs) {
    const result = [];
    let index = 0;
    for (var glyph of glyphs) {
      result.push (this.renderInfoGlyph (glyph, index++));
    }
    return result;
  }

  renderInfo (extended, opacity) {
    const headerInfoStyle = this.mergeStyles ('headerInfo');
    const headerDragStyle = this.mergeStyles ('headerDrag');
    const glyphsStyle = this.mergeStyles ('glyphs');
    headerInfoStyle.opacity = opacity;
    return (
      <div style={headerInfoStyle}>
        <div style={headerDragStyle}>
          <Label
            text        = {this.content}
            wrap        = 'no'
            single-line = 'true'
            grow        = '1'
            {...this.link ()} />
          <div style={glyphsStyle}>
            {this.renderInfoGlyphs (this.glyphs)}
          </div>
        </div>
        <Button
          kind         = 'recurrence'
          glyph        = {extended ? 'caret-up' : 'caret-down'}
          tooltip      = {extended ? 'Compacte la note' : 'Etend la note pour la modifier'}
          active       = {extended ? 'true' : 'false'}
          active-color = {this.props.theme.palette.recurrenceExtendedBoxBackground}
          {...this.link ()} />
      </div>
    );
  }

  renderEditor (extended, opacity) {
    if (extended) {
      const style = this.mergeStyles ('editor');
      style.opacity = opacity;
      return (
        <div style={style}>
          <LabelTextField
            field               = 'Content'
            select-all-on-focus = 'true'
            hint-text           = 'Texte de la note'
            label-glyph         = 'pencil'
            grow                = '3'
            spacing             = 'large'
            rows                = '4'
            {...this.linkContent ()} />
          <Button
            kind     = 'combo'
            text     = 'Pictogrammes'
            active   = {this.showGlyphsDialog ? 'true' : 'false'}
            grow     = '0.2'
            on-click = {this.onOpenGlyphsDialog}
            spacing  = 'large'
            ref      = {x => this.glyphDialogButton = x}
            {...this.link ()} />
          <Button
            glyph    = 'trash'
            tooltip  = 'Supprime la note'
            on-click = {this.onDeleteNote}
            {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  render () {
    this.updateComponent ();

    const extended = this.read ('extended') === 'true';

    // const isDragged = this.props.isDragged;
    // const hasHeLeft = this.props.hasHeLeft;
    const isDragged = this.read ('isDragged');
    const hasHeLeft = this.read ('hasHeLeft');

    const opacity = (!isDragged && hasHeLeft) ? 0.1 : 1.0;
    console.log (`Note.render ${this.noteId} ${opacity}`);

    const mainStyle = this.mergeStyles (extended ? 'mainExtended' : 'mainCompacted');
    const dhd = Unit.add (this.props.theme.shapes.lineHeight, this.props.theme.shapes.containerMargin);

    return (
      <DragCab
        drag-controller    = 'note'
        drag-height-detect = {dhd}
        direction          = 'vertical'
        color              = {this.props.theme.palette.dragAndDropHover}
        thickness          = {this.props.theme.shapes.dragAndDropTicketThickness}
        mode               = 'corner-top-left'
        drag-owner-id      = {this.noteId}
        do-click-action    = {this.onSwapExtended}
        do-drag-ending     = {this.onDragEnding}
        {...this.link ()} >
        <div style={mainStyle}>
          {this.renderInfo (extended, opacity)}
          {this.renderEditor (extended, opacity)}
          {this.renderGlyphsDialog ()}
        </div>
      </DragCab>
    );
  }
}

/******************************************************************************/
