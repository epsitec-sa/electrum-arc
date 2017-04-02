/* global describe it */

import {expect} from 'mai-chai';
import Electrum from 'electrum';
import {React, ReactDOMServer, Store, Theme} from 'electrum';

/******************************************************************************/

class _Foo extends React.Component {
  render () {
    expect (this.mergeStyles ('nice')).to.deep.equal ({color: 'purple'});
    expect (this.mergeStyles ('nice', 'ugly')).to.deep.equal ({color: 'pink'});
    return <div style={this.styles}></div>;
  }
}

const _Foo$styles = function (/* theme */) {
  return {
    base: {fontFamily: 'Verdana'},
    nice: {color: 'purple'},
    ugly: {color: 'pink'}
  };
};

export const Foo = Electrum.wrap ('Foo', _Foo, {styles: _Foo$styles});

/******************************************************************************/

describe ('Style resolution', () => {

  const store = Store.create ();
  const state = store.select ('root');
  const theme = Theme.create ('default');

  describe ('<Foo>', () => {
    it ('applies base style to <div> element', () => {
      const html = ReactDOMServer.renderToStaticMarkup (<Foo state={state} theme={theme}/>);
      expect (html).to.equal ('<div style="font-family:Verdana;" data-radium="true"></div>');
    });
  });

  describe ('<Foo kind="nice">', () => {
    it ('applies base style and nice style to <div> element', () => {
      const html = ReactDOMServer.renderToStaticMarkup (<Foo state={state} theme={theme} kind='nice'/>);
      expect (html).to.equal ('<div style="font-family:Verdana;color:purple;" data-radium="true"></div>');
    });
  });

  describe ('<Foo style={ {color: \'pink\'} }">', () => {
    it ('applies local style on top of computed styles on <div> element', () => {
      const html = ReactDOMServer.renderToStaticMarkup (
        <Foo state={state} theme={theme} kind='nice' style={{color: 'pink'}}/>
      );
      expect (html).to.equal ('<div style="font-family:Verdana;color:pink;" data-radium="true"></div>');
    });
  });
});

/******************************************************************************/
