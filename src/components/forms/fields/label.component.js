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

  getFragments (line) {
    const result = [];
    var i = 0;
    var j = 0;
    var em = false;
    while (i < line.length) {
      if (line[i] === '<') {
        const last = line.substring (i);
        if (last.startsWith ('<em>')) {
          if (j < i) {
            result.push ({em: em, text: line.substring (j, i)});
          }
          em = true;
          i += 4;
          j = i;
        } else if (last.startsWith ('</em>')) {
          if (j < i) {
            result.push ({em: em, text: line.substring (j, i)});
          }
          em = false;
          i += 5;
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

  renderFragment (index, fragment) {
    const style = this.mergeStyles (fragment.em ? 'hilitedFragment' : 'normalFragment');
    return (
      <span key={index} style={style}>
        {fragment.text}
      </span>
    );
  }

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
    const textStyle = this.mergeStyles ('text');
    return (
      <div key={index} style={textStyle}>
        {this.renderFragments (line)}
      </div>
    );
  }

  getLines (lines) {
    const array = [];
    let index = 0;
    lines.map (
      line => {
        array.push (this.renderLine (index++, line));
      }
    );
    return array;
  }

  renderLines (index, lines) {
    const linesStyle = this.mergeStyles ('lines');
    return (
      <div key={index} style={linesStyle}>
        {this.getLines (lines).map ((comp) => comp)}
      </div>
    );
  }

  renderText (index) {
    const inputText = this.read ('text');

    const textStyle = this.mergeStyles ('text');

    if (inputText) {
      if (typeof inputText === 'string') {
        const hasEol = inputText.indexOf ('\\n');
        const hasBr  = inputText.indexOf ('<br/>');
        const hasEm  = inputText.indexOf ('<em>') !== -1;
        if (hasEol === false && hasBr === false || hasEm === false) {
          return (
            <div key={index} style={textStyle}>
              {inputText}
            </div>
          );
        } else {
          const lines = inputText.split (hasEol ? '\\n' : '<br/>');
          return this.renderLines (index, lines);
        }
      } else {
        return (
          <div key={index} style={textStyle}>
            {inputText}
          </div>
        );
      }
    } else {
      return null;
    }
  }

  renderGlyph (index) {
    const inputGlyph  = this.read ('glyph');
    const inputRotate = this.read ('rotate');
    const inputFlip   = this.read ('flip');
    const inputSpin   = this.read ('spin');

    const glyphStyle = this.mergeStyles ('glyph');

    return (
      <i key      = {index}
        style     = {glyphStyle}
        className = {`fa
          fa-${inputGlyph}
          fa-rotate-${inputRotate}
          fa-flip-${inputFlip}
          ${inputSpin ? 'fa-spin' : ''}`}
      />
    );
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputIndex   = this.read ('index');
    const inputText    = this.read ('text');
    const inputGlyph   = this.read ('glyph');
    const inputTooltip = this.read ('tooltip');
    const inputMarquee = this.read ('marquee');

    const boxStyle = this.mergeStyles ('box');

    const layout = () => {
      if (inputGlyph) {
        if (inputText) {
          return [this.renderGlyph (0), this.renderText (1)];
        } else {
          return [ this.renderGlyph (0) ];
        }
      } else {
        return [ this.renderText (0) ];
      }
    };

    if (inputMarquee === 'true') {
      return (
        <marquee
          key      = {inputIndex}
          onClick  = {this.onClick}
          disabled = {disabled}
          style    = {boxStyle}
          title    = {inputTooltip}
        >
          {layout ().map ((comp) => comp)}
          {this.props.children}
        </marquee>
      );
    } else {
      return (
        <div
          key      = {inputIndex}
          onClick  = {this.onClick}
          disabled = {disabled}
          style    = {boxStyle}
          title    = {inputTooltip}
        >
          {layout ().map ((comp) => comp)}
          {this.props.children}
        </div>
      );
    }
  }
}

/******************************************************************************/
