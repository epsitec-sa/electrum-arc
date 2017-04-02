/* global describe it */

import {expect} from 'mai-chai';
import Electrum from 'electrum';
import {React, ReactDOMServer, Store, Theme} from 'electrum';
import {Repeat} from 'electrum-arc';

/******************************************************************************/

const globalTheme = Theme.create ('default');

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

    const html = ReactDOMServer.renderToStaticMarkup (<Foo state={state} theme={globalTheme} bar='42' id='i' />);
    expect (html).to.equal ('<span data-radium="true">xyz/42/i</span>');
  });
});

/******************************************************************************/

describe ('<Repeat>', () => {
  it ('produces empty <div> when arity=0', () => {
    const store = Store.create ();
    const state = store.select ('root.f');

    const html = ReactDOMServer.renderToStaticMarkup (
      <Repeat state={state} theme={globalTheme}>
        <Foo id='i' field='value' bar='42'/>
      </Repeat>
    );

    expect (html).to.equal ('<div></div>');
  });
  it ('produces spans inside <div> when arity=2', () => {
    const store = Store.create ();
    store.select ('root.f$0.name').set ('value', 'x');
    store.select ('root.f$1.name').set ('value', 'y');
    const state = store.select ('root.f');

    const html = ReactDOMServer.renderToStaticMarkup (
      <Repeat state={state} theme={globalTheme}>
        <Foo id='i' sub-field='name' bar='42'/>
      </Repeat>
    );

    expect (html).to.equal (
      '<div data-radium="true">' +
      '<span data-radium="true">x/42/i.0</span>' +
      '<span data-radium="true">y/42/i.1</span>' +
      '</div>'
    );
  });
  it ('produces spans inside <div> when arity=2 (no id)', () => {
    const store = Store.create ();
    store.select ('root.f$0.name').set ('value', 'x');
    store.select ('root.f$1.name').set ('value', 'y');
    const state = store.select ('root.f');

    const html = ReactDOMServer.renderToStaticMarkup (
      <Repeat state={state} theme={globalTheme}>
        <Foo sub-field='name' bar='42'/>
      </Repeat>
    );

    expect (html).to.equal (
      '<div data-radium="true">' +
      '<span data-radium="true">x/42/</span>' +
      '<span data-radium="true">y/42/</span>' +
      '</div>'
    );
  });
  it ('produces spans inside <div> when arity=2 (nested state)', () => {
    const store = Store.create ();
    store.select ('root.f$0.name').set ('value', 'x');
    store.select ('root.f$1.name').set ('value', 'y');
    const state = store.select ('root.f');

    const html = ReactDOMServer.renderToStaticMarkup (
      <Repeat state={state} theme={globalTheme}>
        <h1>
          <Foo id='i' sub-field='name' bar='42'/>
        </h1>
      </Repeat>
    );

    expect (html).to.equal (
      '<div data-radium="true">' +
      '<h1 data-radium="true"><span data-radium="true">x/42/i.0</span></h1>' +
      '<h1 data-radium="true"><span data-radium="true">y/42/i.1</span></h1>' +
      '</div>'
    );
  });
  it ('produces spans inside <div> when arity=2 (nested state, <Group>)', () => {
    const store = Store.create ();
    store.select ('root.f$0.name').set ('value', 'x');
    store.select ('root.f$1.name').set ('value', 'y');
    const state = store.select ('root.f');

    const html = ReactDOMServer.renderToStaticMarkup (
      <Repeat state={state} theme={globalTheme}>
        <Group>
          <Foo id='i' sub-field='name' bar='42'/>
        </Group>
      </Repeat>
    );

    expect (html).to.equal (
      '<div data-radium="true">' +
      '<h1 data-radium="true"><span data-radium="true">x/42/i.0</span></h1>' +
      '<h1 data-radium="true"><span data-radium="true">y/42/i.1</span></h1>' +
      '</div>'
    );
  });
  it ('produces spans inside <div> when arity=2 (nested state, <Group> state-bound)', () => {
    const store = Store.create ();
    store.select ('root.f$0.grp.name').set ('value', 'x');
    store.select ('root.f$1.grp.name').set ('value', 'y');
    const state = store.select ('root.f');

    const html = ReactDOMServer.renderToStaticMarkup (
      <Repeat state={state} theme={globalTheme}>
        <Group sub-field='grp'>
          <Foo id='i' sub-field='name' bar='42'/>
        </Group>
      </Repeat>
    );

    expect (html).to.equal (
      '<div data-radium="true">' +
      '<h1 data-radium="true"><span data-radium="true">x/42/i.0</span></h1>' +
      '<h1 data-radium="true"><span data-radium="true">y/42/i.1</span></h1>' +
      '</div>'
    );
  });
});

/******************************************************************************/
