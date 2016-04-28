'use strict';

import {expect} from 'mai-chai';
import {React, ReactDOMServer, Store, Theme} from 'electrum';
import {Link} from 'electrum-arc';

/******************************************************************************/

describe ('Components', () => {
  describe ('<Link>', () => {
    it ('produces <a> element', () => {
      const store = Store.create ();
      const state = store.select ('root');
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<Link state={state} theme={theme}/>);

      expect (html).to.startWith ('<a');
      expect (html).to.endWith ('</a>');
      expect (html).to.contain ('color:rgba(0,0,0,0.87);');
      expect (html).to.contain ('font-size:.7em;');
      expect (html).to.contain ('font-family:Roboto, sans-serif;');
      expect (html).to.contain ('padding:1em;');
      expect (html).to.contain ('cursor:pointer;');
    });
  });

  describe ('<Link kind="disabled">', () => {
    it ('produces <a> element with disabled kind', () => {
      const store = Store.create ();
      const state = store.select ('root');
      const theme = Theme.create ('default');

      const html = ReactDOMServer.renderToStaticMarkup (<Link state={state} theme={theme} kind='disabled'/>);

      expect (html).to.startWith ('<a');
      expect (html).to.endWith ('</a>');
      expect (html).to.contain ('color:rgba(0,0,0,0.3);');
    });
  });
});

/******************************************************************************/
