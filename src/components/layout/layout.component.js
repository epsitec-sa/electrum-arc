import {React, Trace} from 'electrum';

/******************************************************************************/

export default class Layout extends React.Component {
  render () {
    const {state, workspace} = this.props;
    const layout = state.get ('layout');
    if (layout) {
      Trace.dir (layout);
      layout.init ();
    }
    return (
      <main ref={(element) => state.set (workspace, element)}>
        layout
      </main>
    );
  }
}

/******************************************************************************/
/*
//Properties
root
The topmost item in the layout item tree. In browser terms: Think of the GoldenLayout instance as window object and of goldenLayout.root as the document.

container
A reference to the (jQuery) DOM element containing the layout

isInitialised
True once the layout item tree has been created and the initialised event has been fired.

config
A reference to the current, extended top level config.

Don't rely on this object for state saving / serialisation. Use layout.toConfig() instead.
selectedItem
The currently selected item or null if no item is selected. Only relevant if settings.selectionEnabled is set to true.

width
The current outer width of the layout in pixels

height
The current outer height of the layout in pixels

openPopouts
An array of BrowserWindow instances

isSubWindow
True if the layout has been opened as a popout by another layout

eventHub
A singleton instance of EventEmitter that works across windows

//Events
Events
initialised
Fired after layout.init() has been called and the layout tree has been created.

stateChanged
Fired whenever something happens that updates the state of the layout (as returned by layout.toConfig)

windowOpened
Fired when a new popout window was opened.

windowClosed
Fired when a previously created popout window was closed.

selectionChanged
Fired when the user selects a new / different item. Only relevant if settings.selectionEnabled is true.

itemDestroyed
Fired whenever an item gets destroyed.

itemCreated
Fired whenever an item is created.

componentCreated
Fired whenever a component is created.

rowCreated
Fired whenever a row is created.

columnCreated
Fired whenever a column is created.

stackCreated
Fired whenever a stack is created.

tabCreated
Fired whenever a tab is created.
GoldenLayout( configuration, container )
registerComponent( name, component )
init()
toConfig()
getComponent( name )
updateSize(width, height)
destroy()
createContentItem( itemConfiguration, parent )
createPopout( configOrContentItem, dimensions, parentId, indexInParent )
createDragSource( element, itemConfiguration )
selectItem( contentItem )
GoldenLayout.minifyConfig( config )
GoldenLayout.unminifyConfig( minifiedConfig )*/
