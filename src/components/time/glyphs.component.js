import {React, Store} from 'electrum';
import E from 'electrum';
import {Glyph} from 'electrum-arc';
import * as ReducerGlyphs from './reducer-glyphs.js';

/******************************************************************************/

export default class Glyphs extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify

    this.internalStore.select ('extendedIndex').set ('value', -1);
  }

  componentWillMount () {
    const glyphs = this.read ('value');
    this.internalStore.select ('glyphs').set ('value', glyphs);

    const newGlyph = {
      Name:        '',
      Glyph:       '',
      Description: '',
    };
    this.internalStore.select ('newGlyph').set ('value', newGlyph);
  }

  get extendedIndex () {
    return this.internalStore.select ('extendedIndex').get ('value');
  }

  set extendedIndex (value) {
    this.internalStore.select ('extendedIndex').set ('value', value);
  }

  // LocalBus.notify
  notify (props, source, value) {
    // console.log (`Glyphs.notify field=${props.field} type=${source.type}`);
    const glyphs = this.internalStore.select ('glyphs').get ('value');
    const bus = this.props.bus || E.bus;

    if (source.type === 'change') {
      if (props.field === -1) {  // last line (for create) ?
        this.internalStore.select ('newGlyph').set ('value', value);
      } else {
        const newGlyphs = ReducerGlyphs.reducer (glyphs,
          ReducerGlyphs.updateAction (props.field, value));
        this.internalStore.select ('glyphs').set ('value', newGlyphs);
        this.forceUpdate ();
        bus.notify (this.props, source, newGlyphs);
        // console.dir (newGlyphs);
      }
    } else if (source.type === 'create') {
      const newGlyph = this.internalStore.select ('newGlyph').get ('value');
      const newGlyphs = ReducerGlyphs.reducer (glyphs,
        ReducerGlyphs.addAction (newGlyph));
      bus.notify (this.props, {type: 'change'}, newGlyphs);
      this.internalStore.select ('glyphs').set ('value', newGlyphs);
      this.extendedIndex = newGlyphs.length - 1;  // extend created glyph
      this.forceUpdate ();
    } else if (source.type === 'delete') {
      const newGlyphs = ReducerGlyphs.reducer (glyphs,
        ReducerGlyphs.deleteAction (props.field));
      bus.notify (this.props, {type: 'change'}, newGlyphs);
      this.internalStore.select ('glyphs').set ('value', newGlyphs);
      this.extendedIndex = -1;  // collapse all glyphs
      this.forceUpdate ();
    }
  }

  linkGlyph () {
    return {...this.link (), bus: this.localBus};
  }

  onSwapExtended (index) {
    if (index === this.extendedIndex) {  // if panel extended ?
      index = -1;  // compact the panel
    }
    this.extendedIndex = index;
    this.forceUpdate ();
  }

  renderRow (glyph, create, extended, index) {
    const glyphs = this.read ('glyphs');
    const darken = this.read ('darken');
    return (
      <Glyph
        index            = {index}
        field            = {index}
        value            = {glyph}
        glyphs           = {glyphs}
        darken           = {darken}
        create           = {create   ? 'true' : 'false'}
        extended         = {extended ? 'true' : 'false'}
        do-swap-extended = {this.onSwapExtended}
        {...this.linkGlyph ()} />
    );
  }

  renderRows () {
    const result = [];
    let index = 0;
    const glyphs = this.internalStore.select ('glyphs').get ('value');
    const extendedIndex = this.extendedIndex;
    for (var glyph of glyphs) {
      const extended = (extendedIndex === index);
      result.push (this.renderRow (glyph, false, extended, index++));
    }
    return result;
  }

  renderEditor () {
    const newGlyph = this.internalStore.select ('newGlyph').get ('value');
    return this.renderRow (newGlyph, true, false, -1);  // last line (for create)
  }

  render () {
    const boxStyle = this.mergeStyles ('box');
    return (
      <div style={boxStyle}>
        {this.renderRows ()}
        {this.renderEditor ()}
      </div>
    );
  }
}

/******************************************************************************/
