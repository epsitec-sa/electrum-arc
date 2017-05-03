import {React} from 'electrum';
import {Action} from 'electrum';

/******************************************************************************/

export default class Label extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      text:          this.read ('text'),
      glyph:         this.read ('glyph'),
      grow:          this.read ('grow'),
      kind:          this.read ('kind'),
      justify:       this.read ('justify'),
      width:         this.read ('width'),
      height:        this.read ('height'),
      spacing:       this.read ('spacing'),
      wrap:          this.read ('wrap'),
      vpos:          this.read ('vpos'),
      glyphColor:    this.read ('glyph-color'),
      glyphSize:     this.read ('glyph-size'),
      textColor:     this.read ('text-color'),
      textTransform: this.read ('text-transform'),
      fontWeight:    this.read ('font-weight'),
      fontStyle:     this.read ('font-style'),
      fontSize:      this.read ('font-size'),
      bottomSpacing: this.read ('bottom-spacing'),
      zIndex:        this.read ('z-index'),
    };
  }

  // Splits 'abc<em>def</em>ghi' into three parts.
  getFragments (line) {
    const result = [];
    var i = 0;
    var j = 0;
    var em = false;  // outside <em></em>
    while (i < line.length) {
      if (line[i] === '<') {  // start of tag ?
        const last = line.substring (i);
        if (last.startsWith ('<em>')) {
          if (j < i) {
            result.push ({em: em, text: line.substring (j, i)});
          }
          em = true;  // inside <em></em>
          i += 4;  // skip <em>
          j = i;
        } else if (last.startsWith ('</em>')) {
          if (j < i) {
            result.push ({em: em, text: line.substring (j, i)});
          }
          em = false;  // outside <em></em>
          i += 5;  // skip </em>
          j = i;
        } else {
          i++;
        }
      } else {
        i++;
      }
    }
    if (j < i) {
      result.push ({em: em, text: line.substring (j, i)});
    }
    return result;
  }

  // Render a fragment with normal or hilited style.
  renderFragment (index, fragment) {
    const style = this.mergeStyles (fragment.em ? 'hilitedFragment' : 'normalFragment');
    return (
      <span key={index} style={style}>
        {fragment.text}
      </span>
    );
  }

  // Render all fragments of a line.
  renderFragments (line) {
    const result = [];
    const fragments = this.getFragments (line);
    let index = 0;
    for (var fragment of fragments) {
      result.push (this.renderFragment (index++, fragment));
    }
    return result;
  }

  renderLine (index, line) {
    const style = this.mergeStyles ('text');
    return (
      <div key={index} style={style}>
        {this.renderFragments (line)}
      </div>
    );
  }

  getLines (lines) {
    const array = [];
    let index = 0;
    for (var line of lines) {
      array.push (this.renderLine (index++, line));
    }
    return array;
  }

  renderLines (index, lines) {
    const style = this.mergeStyles ('lines');
    return (
      <div key={index} style={style}>
        {this.getLines (lines)}
      </div>
    );
  }

  // Render a very simple text, that is to say a single line and without highlighting.
  renderSimpleText (index, text) {
    const style = this.mergeStyles ('text');
    return (
      <div key={index} style={style}>
        {text}
      </div>
    );
  }

  renderText (index, text) {
    if (text) {
      if (typeof text === 'string') {
        const hasEol1 = text.indexOf ('\n'   ) !== -1;
        const hasEol2 = text.indexOf ('\\n'  ) !== -1;
        const hasBr   = text.indexOf ('<br/>') !== -1;
        const hasEm   = text.indexOf ('<em>' ) !== -1;
        if (hasEol1 || hasEol2 || hasBr || hasEm) {  // complex text ?
          const lines = text.split (hasBr ? '<br/>' : (hasEol1 ? '\n' : '\\n'));
          return this.renderLines (index, lines);
        } else {
          return this.renderSimpleText (index, text);
        }
      } else {
        return this.renderSimpleText (index, text);
      }
    } else {
      return null;
    }
  }

  renderGlyph (index, glyph) {
    const rotate = this.read ('rotate');
    const flip   = this.read ('flip');
    const spin   = this.read ('spin');

    const style = this.mergeStyles ('glyph');

    return (
      <i key      = {index}
        style     = {style}
        className = {`fa
          fa-${glyph}
          fa-rotate-${rotate}
          fa-flip-${flip}
          ${spin ? 'fa-spin' : ''}`}
      />
    );
  }

  getGlyphAndText () {
    const text  = this.read ('text');
    const glyph = this.read ('glyph');

    if (glyph) {
      if (text) {
        // Glyph followed by text.
        return [this.renderGlyph (0, glyph), this.renderText (1, text)];
      } else {
        // Glyph alone.
        return [ this.renderGlyph (0, glyph) ];
      }
    } else {
      // Text alone.
      return [ this.renderText (0, text) ];
    }
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const index   = this.read ('index');
    const tooltip = this.read ('tooltip');
    const marquee = this.read ('marquee');

    const style = this.mergeStyles ('box');

    if (marquee === 'true') {
      return (
        <marquee
          key      = {index}
          onClick  = {this.onClick}
          disabled = {disabled}
          style    = {style}
          title    = {tooltip}
        >
          {this.getGlyphAndText ()}
          {this.props.children}
        </marquee>
      );
    } else {
      return (
        <div
          key      = {index}
          onClick  = {this.onClick}
          disabled = {disabled}
          style    = {style}
          title    = {tooltip}
        >
          {this.getGlyphAndText ()}
          {this.props.children}
        </div>
      );
    }
  }
}

/******************************************************************************/
