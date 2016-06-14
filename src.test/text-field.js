'use strict';

import {expect} from 'mai-chai';
import {React, ReactDOMServer, Store, Theme} from 'electrum';
import {TextField} from 'electrum-arc';

/******************************************************************************/

describe ('Components', () => {
  describe ('<TextField>', () => {
    it ('produces <input> element with value taken from state', () => {
      const store = Store.create ();
      const state = store.select ('root').set ('value', 'hello');
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<TextField state={state} theme={theme} />);

      expect (html).to.startWith ('<span');
      expect (html).to.endWith ('/></span>');
      expect (html).to.contain ('<input type="text"');
      expect (html).to.contain (' value="hello"');
    });

    it ('produces <input> element with id taken from props', () => {
      const store = Store.create ();
      const state = store.select ('root').set ('value', 'hello');
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<TextField state={state} theme={theme} id="foobar" />);

      expect (html).to.contain (' id="foobar"');
    });
  });
});

/******************************************************************************/
