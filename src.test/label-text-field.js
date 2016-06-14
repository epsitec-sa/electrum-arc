'use strict';

import {expect} from 'mai-chai';
import {React, ReactDOMServer, Store, Theme} from 'electrum';
import {LabelTextField} from 'electrum-arc';

/******************************************************************************/

describe ('Components', () => {
  describe ('<LabelTextField>', () => {
    it ('produces <input> element with value taken from state', () => {
      const store = Store.create ();
      const state = store.select ('root').set ('value', 'hello');
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<LabelTextField state={state} theme={theme} />);

      expect (html).to.startWith ('<span');
      expect (html).to.endWith ('/></span></span>');
      expect (html).to.contain ('<input type="text"');
      expect (html).to.contain (' value="hello"');
    });

    it ('produces <input> element with id taken from props', () => {
      const store = Store.create ();
      const state = store.select ('root').set ('value', 'hello');
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<LabelTextField state={state} theme={theme} id="foobar" />);

      expect (html).to.contain (' id="foobar"');
    });
  });
});

/******************************************************************************/
