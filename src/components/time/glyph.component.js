import {React, Store} from 'electrum';
import {LabelTextField, Button, Label} from 'electrum-arc';

/******************************************************************************/

export default class Glyph extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify
  }

  // LocalBus.notify
  notify (props, source, value) {
    // console.log (`Glyph.notify field=${props.field} type=${source.type}`);
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
    const name        = this.internalStore.select ('Name').get ('value');
    const glyph       = this.internalStore.select ('Glyph'  ).get ('value');
    const description = this.internalStore.select ('Description').get ('value');

    return {
      id:          this.glyphId,
      Name:        name,
      Glyph:       glyph,
      Description: description,
    };
  }

  linkName () {
    return {...this.link (), state: this.internalStore.select ('Name'), bus: this.localBus};
  }

  linkGlyph () {
    return {...this.link (), state: this.internalStore.select ('Glyph'), bus: this.localBus};
  }

  linkDescription () {
    return {...this.link (), state: this.internalStore.select ('Description'), bus: this.localBus};
  }

  updateComponent () {
    const glyph = this.read ('value');
    if (glyph !== this.lastGlyph) {
      this.updateInternalState (glyph);
      this.lastGlyph = glyph;
      this.updateInfo ();
    }
  }

  updateInternalState (data) {
    const name        = data.Name;
    const glyph       = data.Glyph;
    const description = data.Description;

    this.glyphId = glyph.id;

    this.internalStore.select ('Name'       ).set ('value', name);
    this.internalStore.select ('Glyph'      ).set ('value', glyph);
    this.internalStore.select ('Description').set ('value', description);
  }

  updateInfo () {
    this.name        = this.internalStore.select ('Name'       ).get ('value');
    this.glyph       = this.internalStore.select ('Glyph'      ).get ('value');
    this.description = this.internalStore.select ('Description').get ('value');
  }

  onCreateGlyph () {
    this.notifyParent ('create');
    this.updateInfo ();
    this.forceUpdate ();
  }

  onDeleteGlyph () {
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
          text = {this.name}
          kind = 'title-recurrence'
          grow = '1'
          {...this.link ()} />
        <Label
          text = {this.glyph}
          kind = 'title-recurrence'
          grow = '1'
          {...this.link ()} />
        <Label
          text        = {this.description}
          kind        = 'title-recurrence'
          single-line = 'true'
          wrap        = 'no'
          grow        = '2'
          {...this.link ()} />
        <Button
          kind            = 'recurrence'
          glyph           = {extended ? 'caret-up' : 'caret-down'}
          tooltip         = {extended ? 'Compacte le glyph' : 'Etend le glyph pour la modifier'}
          active          = {extended ? 'true' : 'false'}
          custom-on-click = {this.onSwapExtended}
          {...this.link ()} />
      </div>
    );
  }

  renderEditor (create, extended) {
    const editStyle = this.mergeStyles (create ? 'headerEditor' : 'editor');

    const buttonGlyph   = create ? 'plus' : 'trash';
    const buttonTooltip = create ? 'Crée un nouveau glyph' : 'Supprime le glyph';
    const buttonAction  = create ? this.onCreateGlyph : this.onDeleteGlyph;

    return (
      <div style={editStyle}>
        <LabelTextField
          field               = 'Name'
          select-all-on-focus = 'true'
          hint-text           = 'Nom court'
          label-glyph         = 'tag'
          grow                = '1'
          spacing             = 'large'
          {...this.linkName ()} />
        <LabelTextField
          field               = 'Glyph'
          select-all-on-focus = 'true'
          hint-text           = 'Nom du glyph'
          label-glyph         = 'picture-o'
          grow                = '1'
          spacing             = 'large'
          {...this.linkGlyph ()} />
        <LabelTextField
          field               = 'Description'
          select-all-on-focus = 'true'
          hint-text           = 'Description'
          label-glyph         = 'pencil'
          grow                = '2'
          spacing             = 'large'
          rows                = {extended ? 10 : null}
          {...this.linkDescription ()} />
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
