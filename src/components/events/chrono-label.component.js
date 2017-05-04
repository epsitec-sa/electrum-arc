import {React} from 'electrum';
import {Label} from '../../all-components.js';

/******************************************************************************/

export default class ChronoLabel extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
    };
  }

  get hover () {
    return this.state.hover;
  }

  set hover (value) {
    this.setState ( {
      hover: value
    });
  }

  get styleProps () {
    return {
      lineWidth:  this.read ('lineWidth'),
      glyphWidth: this.read ('glyphWidth'),
    };
  }

  onMyMouseOver () {
    this.hover = true;
    const x = this.read ('mouseOver');
    if (x) {
      const event = this.read ('event');
      x (event);
    }
  }

  onMyMouseOut () {
    this.hover = false;
    const x = this.read ('mouseOut');
    if (x) {
      const event = this.read ('event');
      x (event);
    }
  }

  /******************************************************************************/

  renderTooltip (text, isDragged) {
    if (!isDragged && this.hover && text) {
      const style = this.mergeStyles ('tooltip');
      return (
        <div style={style} key='tooltip'>
          <Label
            index = '2'
            text  = {text}
            grow  = '1'
            wrap  = 'stretch'
            {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderGlyph (glyph, index) {
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

  renderGlyphs (note) {
    if (note) {
      const result = [];
      let index = 0;
      for (var glyph of note.Glyphs) {
        result.push (this.renderGlyph (glyph, index++));
      }
      return result;
    } else {
      return null;
    }
  }

  renderFull (isDragged) {
    const index = this.read ('index');
    const note  = this.read ('note');

    const text = note ? note.Content : null;

    const lineStyle   = this.mergeStyles ('line');
    const glyphsStyle = this.mergeStyles ('glyphs');
    const frontStyle  = this.mergeStyles ('front');

    return (
      <div style={lineStyle} key={index}>
        <div style={glyphsStyle} key='glyphs'>
          {this.renderGlyphs (note)}
        </div>
        <Label index='1' text={text} grow='1' wrap='no' {...this.link ()} />
        {this.renderTooltip (text, isDragged)}
        <div
          key         = 'front'
          style       = {frontStyle}
          onMouseOver = {this.onMyMouseOver}
          onMouseOut  = {this.onMyMouseOut}
          />
      </div>
    );
  }

  renderEmpty () {
    const index = this.read ('index');
    const lineStyle = this.mergeStyles ('empty');
    return (
      <div style={lineStyle} key={index} />
    );
  }

  render () {
    const isDragged = this.read ('isDragged');
    const hasHeLeft = this.read ('hasHeLeft');

    if (hasHeLeft && !isDragged) {
      return this.renderEmpty ();
    } else {
      return this.renderFull (isDragged);
    }
  }
}

/******************************************************************************/
