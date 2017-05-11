import {React, Store} from 'electrum';
import {LabelTextField, Button, Label} from 'electrum-arc';
import * as Converters from './converters';
import * as CronHelpers from './cron-helpers';

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
    const glyph   = this.internalStore.select ('Glyph'  ).get ('value');

    return {
      id:      this.noteId,
      Content: content,
      Glyph:   glyph,
    };
  }

  linkContent () {
    return {...this.link (), state: this.internalStore.select ('Content'), bus: this.localBus};
  }

  linkGlyph () {
    return {...this.link (), state: this.internalStore.select ('Glyph'), bus: this.localBus};
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
    const glyph   = note.Glyph;

    this.noteId = note.id;

    this.internalStore.select ('Content').set ('value', content);
    this.internalStore.select ('Glyph'  ).set ('value', glyph);
  }

  updateInfo () {
    this.content = this.internalStore.select ('Content').get ('value');
    this.glyph   = this.internalStore.select ('Glyph'  ).get ('value');
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

  renderInfo (extended) {
    const style = this.mergeStyles (extended ? 'headerInfoExtended' : 'headerInfoCompacted');
    return (
      <div style={style}>
        <Label
          text = {this.content}
          kind = 'title-recurrence'
          grow = '3'
          {...this.link ()} />
        <Label
          text = {this.glyph}
          kind = 'title-recurrence'
          grow = '1'
          {...this.link ()} />
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
          rows                = {extended ? 10 : null}
          {...this.linkContent ()} />
        <LabelTextField
          field               = 'Glyph'
          select-all-on-focus = 'true'
          hint-text           = 'Nom du glyph'
          label-glyph         = 'picture-o'
          grow                = '1'
          spacing             = 'large'
          {...this.linkGlyph ()} />
        <Button
          glyph           = {buttonGlyph}
          tooltip         = {buttonTooltip}
          custom-on-click = {buttonAction}
          {...this.link ()} />
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
          </div>
        </div>
      );
    }
  }
}

/******************************************************************************/
