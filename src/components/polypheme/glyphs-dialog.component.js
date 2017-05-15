import {React, Store} from 'electrum';
import {DialogModal, Container, Button, Label, Separator} from '../../all-components.js';
import * as GlyphHelpers from '../polypheme/glyph-helpers.js';
import {ColorHelpers} from 'electrum-theme';
import Enumerable from 'linq';

/******************************************************************************/

export default class GlyphsDialog extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify

    const allGlyphs      = this.read ('all-glyphs');
    const selectedGlyphs = this.read ('selected-glyphs');
    this.internalStore.select ('allGlyphs'     ).set ('value', allGlyphs);
    this.internalStore.select ('selectedGlyphs').set ('value', selectedGlyphs);
  }

  componentWillMount () {
  }

  // LocalBus.notify
  notify (props, source, value) {
    if (source.type === 'change') {
      this.internalStore.select (props.field).set ('value', value);
    }
  }

  closeDialog (action) {
    const x = this.read ('close-dialog');
    if (x) {
      x ();
    }
  }

  onAccept () {
    this.closeDialog ('accept');
  }

  onCancel () {
    this.closeDialog ('cancel');
  }

  onToggleGlyph (glyph) {
    console.log ('GlyphsDialog.onToggleGlyph');
    const x = this.read ('glyph-clicked');
    if (x) {
      x (glyph);
    }
  }

  renderGlyph (glyph, selected) {
    const g = GlyphHelpers.getGlyph (glyph.Glyph);
    const color = ColorHelpers.getMarkColor (this.props.theme, g.color);
    return (
      <Button
        width           = '200px'
        kind            = 'glyph-item'
        glyph           = {g.glyph}
        glyph-color     = {color}
        text            = {glyph.Name}
        active          = {selected ? 'true' : 'false'}
        custom-on-click = {() => this.onToggleGlyph (glyph)}
        {...this.link ()}/>
    );
  }

  renderGlyphs () {
    const allGlyphs      = this.internalStore.select ('allGlyphs'     ).get ('value');
    const selectedGlyphs = this.internalStore.select ('selectedGlyphs').get ('value');
    const result = [];
    for (var glyph of allGlyphs) {
      const selected = Enumerable.from (selectedGlyphs).where (x => x.id === glyph.id).any ();
      result.push (this.renderGlyph (glyph, selected));
    }
    return result;
  }

  renderMain () {
    return (
      <Container kind='column' {...this.link ()} >
        <Label
          text = 'Choix des pictogrammes'
          grow = '1'
          kind = 'title'
          {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <Container kind='wrap' {...this.link ()} >
          {this.renderGlyphs ()}
        </Container>
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
      </Container>
    );
  }

  renderFooter () {
    return (
      <Container kind='row' {...this.link ()} >
        <Button
          glyph           = 'check'
          text            = 'Fermer'
          kind            = 'action'
          grow            = '1'
          place           = 'left'
          custom-on-click = {this.onAccept}
          {...this.link ()} />
        <Button
          glyph           = 'close'
          text            = 'Annuler'
          kind            = 'action'
          grow            = '1'
          place           = 'right'
          custom-on-click = {this.onCancel}
          {...this.link ()} />
      </Container>
    );
  }

  render () {
    return (
      <DialogModal width='800px' {...this.link ()}>
        <Container kind='views' {...this.link ()} >
          <Container kind='full-view' {...this.link ()} >
            {this.renderMain ()}
            {this.renderFooter ()}
          </Container>
        </Container>
      </DialogModal>
    );
  }
}

/******************************************************************************/
