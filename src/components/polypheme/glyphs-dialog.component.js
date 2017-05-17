import {React} from 'electrum';
import {DialogModal, Container, Button, Label, DragCab} from '../../all-components.js';
import * as GlyphHelpers from '../polypheme/glyph-helpers.js';
import {ColorHelpers} from 'electrum-theme';
import Enumerable from 'linq';
import {Unit} from 'electrum-theme';

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

  renderGlyphButton (glyph, selected) {
    const g = GlyphHelpers.getGlyph (glyph.Glyph);
    const color = ColorHelpers.getMarkColor (this.props.theme, g.color);
    return (
      <Button
        kind            = 'glyph-item'
        glyph           = {g.glyph}
        glyph-color     = {color}
        text            = {glyph.Name}
        active          = {selected ? 'true' : 'false'}
        custom-on-click = {() => this.onToggleGlyph (glyph)}
        {...this.link ()}/>
    );
  }

  renderGlyphButtons () {
    const allGlyphs      = this.read ('all-glyphs');
    const selectedGlyphs = this.read ('selected-glyphs');
    const result = [];
    for (var glyph of allGlyphs) {
      const selected = Enumerable.from (selectedGlyphs).where (x => x.id === glyph.id).any ();
      result.push (this.renderGlyphButton (glyph, selected));
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
            <Button
              glyph           = 'trash'
              tooltip         = 'Supprime tous les pictogrammes'
              custom-on-click = {this.onClearGlyphs}
              {...this.link ()} />
          </Container>
        <div style={glyphsStyle}>
          {this.renderGlyphButtons ()}
        </div>
      </div>
    );
  }

  renderGlyphSample (glyph, index) {
    const g = GlyphHelpers.getGlyph (glyph.Glyph);
    return (
      <DragCab
        drag-controller = 'glyph-sample'
        direction       = 'horizontal'
        drag-owner-id   = {glyph.id}
        color           = {this.props.theme.palette.dragAndDropHover}
        thickness       = {this.props.theme.shapes.dragAndDropTicketThickness}
        {...this.link ()}>
        <Label
          width       = '70px'
          index       = {index}
          glyph       = {g.glyph}
          glyph-color = {g.color}
          glyph-size  = '300%'
          spacing     = 'compact'
          justify     = 'center'
          {...this.link ()} />
      </DragCab>
    );
  }

  renderGlyphSamples () {
    const selectedGlyphs = this.read ('selected-glyphs');
    const result = [];
    let index = 0;
    for (var glyph of selectedGlyphs) {
      result.push (this.renderGlyphSample (glyph, index++));
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
          width           = '180px'
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

    const buttonWidth  = Unit.add (this.props.theme.shapes.glyphsDialogButtonWidth, this.props.theme.shapes.glyphsDialogButtonMargin);
    const buttonsWidth = Unit.multiply (buttonWidth, 3);  // 3 columns of buttons
    const dialogWidth  = Unit.add (buttonsWidth, '25px');  // add scroller width

    return (
      <DialogModal
        width  = {dialogWidth}
        center = {center}
        top    = {top}
        bottom = {bottom}
        close  = {this.onClose}
        {...this.link ()}>
        {this.renderMain ()}
        <div style={footerStyle}>
          <Container
            kind            = 'glyph-samples'
            drag-controller = 'glyph-sample'
            drag-source     = 'glyph-samples'
            drag-owner-id   = 'glyph-samples'
            {...this.link ()} >
            {this.renderGlyphSamples ()}
          </Container>
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
