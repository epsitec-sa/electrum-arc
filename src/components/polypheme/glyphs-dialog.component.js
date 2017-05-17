import {React} from 'electrum';
import {DialogModal, Container, Button, Label} from '../../all-components.js';
import * as GlyphHelpers from '../polypheme/glyph-helpers.js';
import {ColorHelpers} from 'electrum-theme';
import Enumerable from 'linq';

/******************************************************************************/

export default class GlyphsDialog extends React.Component {

  constructor (props) {
    super (props);
  }

  onClose () {
    const x = this.read ('close-dialog');
    if (x) {
      x ();
    }
  }

  onToggleGlyph (glyph) {
    // console.log ('GlyphsDialog.onToggleGlyph');
    const x = this.read ('glyph-clicked');
    if (x) {
      x (glyph);
    }
  }

  onClearGlyphs () {
    const x = this.read ('clear-glyphs');
    if (x) {
      x ();
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
    const allGlyphs      = this.read ('all-glyphs');
    const selectedGlyphs = this.read ('selected-glyphs');
    const result = [];
    for (var glyph of allGlyphs) {
      const selected = Enumerable.from (selectedGlyphs).where (x => x.id === glyph.id).any ();
      result.push (this.renderGlyph (glyph, selected));
    }
    return result;
  }

  renderMain () {
    const mainStyle   = this.mergeStyles ('main');
    const glyphsStyle = this.mergeStyles ('glyphs');
    return (
      <div style={mainStyle}>
        <Container kind='row' {...this.link ()} >
          <Label
            text = 'Choix des pictogrammes'
            grow = '1'
            kind = 'title'
            {...this.link ()} />
            <Label grow='1' {...this.link ()} />
            <Button
              glyph           = 'trash'
              tooltip         = 'Supprime tous les pictogrammes'
              custom-on-click = {this.onClearGlyphs}
              {...this.link ()} />
          </Container>
        <div style={glyphsStyle}>
          {this.renderGlyphs ()}
        </div>
      </div>
    );
  }

  renderSampleGlyph (glyph, index) {
    const g = GlyphHelpers.getGlyph (glyph.Glyph);
    return (
      <Label
        width       = '70px'
        index       = {index}
        glyph       = {g.glyph}
        glyph-color = {g.color}
        glyph-size  = '300%'
        spacing     = 'compact'
        justify     = 'center'
        {...this.link ()} />
    );
  }

  renderSample () {
    const selectedGlyphs = this.read ('selected-glyphs');
    const result = [];
    let index = 0;
    for (var glyph of selectedGlyphs) {
      result.push (this.renderSampleGlyph (glyph, index++));
    }
    return result;
  }

  renderFooter () {
    return (
      <Container kind='row' {...this.link ()} >
        <Label grow='1' {...this.link ()} />
        <Button
          glyph           = 'check'
          text            = 'Fermer'
          kind            = 'action'
          width           = '200px'
          place           = '1/1'
          custom-on-click = {this.onClose}
          {...this.link ()} />
      </Container>
    );
  }

  render () {
    const center = this.read ('center');
    const top    = this.read ('top');
    const bottom = this.read ('bottom');

    const footerStyle = this.mergeStyles ('footer');
    const sampleStyle = this.mergeStyles ('sample');

    return (
      <DialogModal
        width  = '760px'
        center = {center}
        top    = {top}
        bottom = {bottom}
        close  = {this.onClose}
        {...this.link ()}>
        {this.renderMain ()}
        <div style={footerStyle}>
          <div style={sampleStyle}>
            {this.renderSample ()}
          </div>
          <Label grow='1' {...this.link ()} />
          <Button
            glyph           = 'check'
            text            = 'Fermer'
            kind            = 'action'
            width           = '200px'
            place           = '1/1'
            custom-on-click = {this.onClose}
            {...this.link ()} />
        </div>
      </DialogModal>
    );
  }
}

/******************************************************************************/
