import {React, Store} from 'electrum';
import {LabelTextField, Glyphs, Button, Label, Container, GlyphsDialog} from 'electrum-arc';
import * as GlyphHelpers from '../polypheme/glyph-helpers.js';
import Enumerable from 'linq';
import * as ReducerGlyphs from './reducer-glyphs.js';

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

  onCreateNote () {
    this.notifyParent ('create');
    this.updateInfo ();
    this.forceUpdate ();
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
    console.log ('Note.onGlyphClicked');
    // if (Enumerable.from (this.glyphs).where (x => x.id === glyph.id).any ()) {
    //   // this.glyphs.splice ();
    // } else {
    //   var g = {...this.glyphs, glyph};
    //   this.internalStore.select ('Glyphs' ).set ('value', g);
    //   this.notifyParent ('change');
    //   this.updateInfo ();
    //   this.forceUpdate ();
    // }
    const newGlyphs = ReducerGlyphs.reducer (this.glyphs,
      ReducerGlyphs.toggleAction (glyph));
    this.internalStore.select ('Glyphs').set ('value', newGlyphs);
    this.notifyParent ('change');
    this.updateInfo ();
    this.forceUpdate ();
    // bus.notify (this.props, source, newGlyphs);
  }

  onOpenGlyphsDialog () {
    this.showGlyphsDialog = true;
    this.forceUpdate ();
  }

  onCloseGlyphsDialog () {
    this.showGlyphsDialog = false;
    this.forceUpdate ();
  }

  renderGlyphsDialog () {
    if (this.showGlyphsDialog) {
      const allGlyphs = this.read ('glyphs');
      return (
        <GlyphsDialog
          all-glyphs      = {allGlyphs}
          selected-glyphs = {this.glyphs}
          glyph-clicked   = {this.onGlyphClicked}
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
        glyph       = {g.glyph}
        glyph-color = {g.color}
        spacing     = 'compact'
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

  renderInfo (extended) {
    const style = this.mergeStyles (extended ? 'headerInfoExtended' : 'headerInfoCompacted');
    return (
      <div
        style       = {style}
        onMouseDown = {this.onSwapExtended}
        >
        <Label
          text        = {this.content}
          kind        = 'title-recurrence'
          wrap        = 'no'
          single-line = 'true'
          grow        = '3'
          {...this.link ()} />
        <Container
          kind = 'row'
          grow = '1'
          {...this.link ()} >
          {this.renderInfoGlyphs (this.glyphs)}
        </Container>
        <Button
          kind    = 'recurrence'
          glyph   = {extended ? 'caret-up' : 'caret-down'}
          tooltip = {extended ? 'Compacte la note' : 'Etend la note pour la modifier'}
          active  = {extended ? 'true' : 'false'}
          {...this.link ()} />
      </div>
    );
  }

  renderEditor (create, extended) {
    const editStyle = this.mergeStyles (create ? 'headerEditor' : 'editor');

    const buttonGlyph   = create ? 'plus' : 'trash';
    const buttonTooltip = create ? 'Crée une nouvelle note' : 'Supprime la note';
    const buttonAction  = create ? this.onCreateNote : this.onDeleteNote;

    return (
      <div style={editStyle}>
        <LabelTextField
          field               = 'Content'
          select-all-on-focus = 'true'
          hint-text           = 'Texte de la note'
          label-glyph         = 'pencil'
          grow                = '3'
          spacing             = 'large'
          rows                = {extended ? 4 : null}
          {...this.linkContent ()} />
        <Button
          text            = 'Pictogrammes'
          grow            = '0.2'
          custom-on-click = {this.onOpenGlyphsDialog}
          spacing         = 'large'
          {...this.link ()} />
        <Button
          glyph           = {buttonGlyph}
          tooltip         = {buttonTooltip}
          custom-on-click = {buttonAction}
          {...this.link ()} />
      </div>
    );
  }

  renderCreateEditor () {
    const editStyle = this.mergeStyles ('headerEditor');

    const buttonGlyph  = 'plus';
    const buttonAction = this.onCreateNote;

    return (
      <div style={editStyle}>
        <Button
          glyph           = {buttonGlyph}
          text            = 'Créer une nouvelle note'
          glyph-position  = 'right'
          custom-on-click = {buttonAction}
          {...this.link ()} />
      </div>
    );
  }

  renderGlyphs () {
    const glyphs = this.read ('glyphs');
    const style = this.mergeStyles ('glyphs');
    return (
      <div style={style}>
        <Glyphs
          field  = 'Glyphs'
          glyphs = {glyphs}
          darken = '0.1'
          {...this.linkGlyphs ()} />
      </div>
    );
  }

  render () {
    this.updateComponent ();

    const create   = this.read ('create') === 'true';
    const extended = this.read ('extended') === 'true';

    const mainStyle = this.mergeStyles ('main');

    if (create) {
      return (
        <div style={mainStyle}>
          {this.renderCreateEditor ()}
        </div>
      );
    } else {
      const boxStyle = this.mergeStyles (extended ? 'extendedBox' : 'compactedBox');
      return (
        <div style={mainStyle}>
          {this.renderInfo (extended)}
          <div style={boxStyle}>
            {this.renderEditor (create, extended)}
          </div>
          {this.renderGlyphsDialog ()}
        </div>
      );
    }
  }
}

/******************************************************************************/
