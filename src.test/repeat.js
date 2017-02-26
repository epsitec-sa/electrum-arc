/* global describe it */

import {expect} from 'mai-chai';
import Electrum from 'electrum';
import {React, ReactDOMServer, Store, Theme} from 'electrum';
import {Repeat} from 'electrum-arc';

/******************************************************************************/

const theme = Theme.create ('default');

/******************************************************************************/

class _Foo extends React.Component {
  render () {
    const {state, theme, bar, id} = this.props;
    expect (state).to.exist ();
    expect (theme).to.exist ();
    const value = this.read ('value');
    return <span>{value}/{bar}/{id}</span>;
  }
}

class _Group extends React.Component {
  render () {
    const {state, theme, children} = this.props;
    expect (state).to.exist ();
    expect (theme).to.exist ();
    return <h1>{children}</h1>;
  }
}

const Foo   = Electrum.wrap ('Foo', _Foo, {});
const Group = Electrum.wrap ('Group', _Group, {});

/******************************************************************************/

describe ('<Foo>', () => {
  it ('produces expected content', () => {
    const store = Store.create ();
    const state = store.select ('root.f').set ('value', 'xyz');

    const html = ReactDOMServer.renderToStaticMarkup (<Foo state={state} theme={theme} bar='42' id='i' />);
    expect (html).to.equal ('<span data-radium="true">xyz/42/i</span>');
  });
});

/******************************************************************************/

describe ('<Repeat>', () => {
  it ('produces empty <div> from field state where arity=0', () => {
    const store = Store.create ();
    const state = store.select ('root.f');
    const html  = ReactDOMServer.renderToStaticMarkup (<Repeat state={state} theme={theme} ><Foo id='i' field='value' bar='42'/></Repeat>);
    expect (html).to.equal ('<div></div>');
  });

  it ('produces collection from field state where arity=2', () => {
    const store = Store.create ();
    store.select ('root.f$0.name').set ('value', 'x');
    store.select ('root.f$1.name').set ('value', 'y');
    const state = store.select ('root.f');
    const html  = ReactDOMServer.renderToStaticMarkup (<Repeat state={state} theme={theme} ><Foo id='i' field='name' bar='42'/></Repeat>);
    expect (html).to.equal (
      '<div data-radium="true">' +
      '<span data-radium="true">x/42/i</span>' +
      '<span data-radium="true">y/42/i</span>' +
      '</div>'
    );
  });

  it ('produces collection from field state where arity=2 (nested)', () => {
    const store = Store.create ();
    store.select ('root.f$0.name').set ('value', 'x');
    store.select ('root.f$1.name').set ('value', 'y');
    const state = store.select ('root.f');
    const html = ReactDOMServer.renderToStaticMarkup (<Repeat state={state} theme={theme} ><h1><Foo id='i' field='name' bar='42'/></h1></Repeat>);
    expect (html).to.equal (
      '<div data-radium="true">' +
      '<h1 data-radium="true"><span data-radium="true">x/42/i</span></h1>' +
      '<h1 data-radium="true"><span data-radium="true">y/42/i</span></h1>' +
      '</div>'
    );
  });

  it ('produces collection from field state where arity=2 (nested, <Group>)', () => {
    const store = Store.create ();
    store.select ('root.f$0.name').set ('value', 'x');
    store.select ('root.f$1.name').set ('value', 'y');
    const state = store.select ('root.f');
    const html  = ReactDOMServer.renderToStaticMarkup (<Repeat state={state} theme={theme} ><Group><Foo id='i' field='name' bar='42'/></Group></Repeat>);
    expect (html).to.equal (
      '<div data-radium="true">' +
      '<h1 data-radium="true"><span data-radium="true">x/42/i</span></h1>' +
      '<h1 data-radium="true"><span data-radium="true">y/42/i</span></h1>' +
      '</div>'
    );
  });

  it ('produces collection from field state where arity=2 (nested deeply, <Group>)', () => {
    const store = Store.create ();
    store.select ('root.f$0.grp.name').set ('value', 'x');
    store.select ('root.f$1.grp.name').set ('value', 'y');
    const state = store.select ('root.f');
    const html = ReactDOMServer.renderToStaticMarkup (<Repeat state={state} theme={theme} ><Group field='grp'><Foo id='i' field='name' bar='42'/></Group></Repeat>);
    expect (html).to.equal (
      '<div data-radium="true">' +
      '<h1 data-radium="true"><span data-radium="true">x/42/i</span></h1>' +
      '<h1 data-radium="true"><span data-radium="true">y/42/i</span></h1>' +
      '</div>'
    );
  });
});

/******************************************************************************/
