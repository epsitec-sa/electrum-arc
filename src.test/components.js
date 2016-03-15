'use strict';

import {expect} from 'mai-chai';
import {React, ReactDOMServer, Store, Theme} from 'electrum';
import {Link} from 'electrum-arc';


describe ('Components', () => {
  describe ('<Link>', () => {
    it ('produces <a> element', () => {
      const store = Store.create ();
      const state = store.select ('root');
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<Link state={state} theme={theme}/>);

      expect (html).to.startWith ('<a');
      expect (html).to.endWith ('</a>');
    });
  });
});
