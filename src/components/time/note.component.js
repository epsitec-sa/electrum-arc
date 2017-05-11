import {React, Store} from 'electrum';
import {LabelTextField, Glyphs, Button, Label, Container} from 'electrum-arc';

/******************************************************************************/

export default class Note extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify
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

  renderInfoGlyph (glyph, index) {
    if (glyph.Glyph.startsWith ('bookmark-')) {
      const color = glyph.Glyph.substring (9);
      return (
        <Label
          index       = {index}
          glyph       = 'bookmark'
          glyph-color = {color}
          spacing     = 'compact'
          {...this.link ()} />
      );
    } else {
      return (
        <Label
          index       = {index}
          glyph       = {glyph.Glyph}
          glyph-color = {glyph.Color}
          spacing     = 'compact'
          {...this.link ()} />
      );
    }
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
      <div style={style}>
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
          kind            = 'recurrence'
          glyph           = {extended ? 'caret-up' : 'caret-down'}
          tooltip         = {extended ? 'Compacte la note' : 'Etend la note pour la modifier'}
          active          = {extended ? 'true' : 'false'}
          custom-on-click = {this.onSwapExtended}
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
          glyph           = {buttonGlyph}
          tooltip         = {buttonTooltip}
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
          {this.renderEditor (create)}
        </div>
      );
    } else {
      const boxStyle = this.mergeStyles (extended ? 'extendedBox' : 'compactedBox');
      return (
        <div style={mainStyle}>
          {this.renderInfo (extended)}
          <div style={boxStyle}>
            {this.renderEditor (create, extended)}
            {this.renderGlyphs ()}
          </div>
        </div>
      );
    }
  }
}

/******************************************************************************/
