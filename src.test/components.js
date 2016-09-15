'use strict';

import {expect} from 'mai-chai';
import {React, ReactDOMServer, Store, Theme} from 'electrum';
import {Link} from 'electrum-arc';

/******************************************************************************/

describe ('Components', () => {
  describe ('<Link>', () => {
    it ('produces <a> element', () => {
      const store = Store.create ();
      const state = store.select ('root').set ({status: 'enabled'});
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<Link state={state} theme={theme} text='hello'/>);

      expect (html).to.startWith ('<a');
      expect (html).to.endWith ('>hello</a>');
      expect (html).to.contain ('font-size:.7em;');
      expect (html).to.contain ('font-family:Roboto, sans-serif;');
      expect (html).to.contain ('padding:1em;');
      expect (html).to.contain ('cursor:pointer;');
    });
  });

  describe ('<Link> in disabled state', () => {
    it ('produces <a> element with disabled kind', () => {
      const store = Store.create ();
      const state = store.select ('root').set ({status: 'disabled'});
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<Link state={state} theme={theme} />);

      expect (html).to.startWith ('<a');
      expect (html).to.endWith ('</a>');
    });
  });
});

/******************************************************************************/
