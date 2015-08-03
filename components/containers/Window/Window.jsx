'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  childContextTypes: {
    storeId: React.PropTypes.string.isRequired,
    navigationMode: React.PropTypes.string.isRequired,
  },

  //  Context gets injected by the dynamic component created by method
  //  ReactResources.GetComponentSource() in ReactResources.cs
  contextTypes: {
    storeId: React.PropTypes.string.isRequired,
    navigationMode: React.PropTypes.string.isRequired,
    navigationZIndex: React.PropTypes.number.isRequired,
  },

  getChildContext: function getChildContext () {
    var storeId = this.getStoreId ();
    var navigationMode = this.getNavigationMode ();
    return {
      storeId: storeId,
      navigationMode: navigationMode,
    };
  },

  getStoreId: function getStoreId () {
    return this.props.storeId || this.context.storeId;
  },

  getNavigationMode: function getNavigationMode () {
    return this.props.navigationMode || this.context.navigationMode || 'None';
  },

  getNavigationZIndex: function getNavigationZIndex () {
    return this.context.navigationZIndex || 0;
  },

  render: function render () {
    var A            = require ('arc');
    var Paper        = A.Paper;
    var DialogWindow = A.DialogWindow;
    var SidePanel    = A.SidePanel;
    var Link         = A.Link;
    var Container    = null;

    // Build and apply styles
    var theme      = this.theme ? this.theme.viewer || {} : {};
    var appliedStyle = [
      theme.base,
      theme[this.props.theme]
    ];

    // switch nav mode:
    switch (this.getNavigationMode ()) {
      case 'modeless':
      case 'DisplayFlyout':
        Container = (
          <DialogWindow
            boxstyle={appliedStyle}
            modal={false}
            z-index={this.getNavigationZIndex ()} >
            {this.props.children}
          </DialogWindow>
        );
        break;
      case 'modal':
      case 'DisplayPopup':
        Container = (
          <DialogWindow
            boxstyle={appliedStyle}
            modal={true}
            z-index={this.getNavigationZIndex ()} >
            {this.props.children}
          </DialogWindow>
        );
        break;
      case 'LeftPanel':
          Container = (
            <SidePanel
              side="left"
              overlay={true}
              boxstyle={appliedStyle}
              z-index={this.getNavigationZIndex ()} >
              {this.props.children}
            </SidePanel>
          );
          break;
      case 'RightPanel':
        Container = (
          <SidePanel
            side="right"
            overlay={true}
            boxstyle={appliedStyle}
            z-index={this.getNavigationZIndex ()} >
            {this.props.children}
          </SidePanel>
        );
        break;
        case 'TopPanel':
          Container = (
            <SidePanel
              side="top"
              overlay={false}
              boxstyle={appliedStyle}
              z-index={this.getNavigationZIndex ()} >
              {this.props.children}
            </SidePanel>
          );
        break;
        case 'BottomPanel':
          Container = (
            <SidePanel
              side="bottom"
              overlay={false}
              boxstyle={appliedStyle}
              z-index={this.getNavigationZIndex ()} >
              {this.props.children}
            </SidePanel>
          );
          break;
      default:
        Container = (
          <Paper
            kind="view"
            z-index={this.getNavigationZIndex ()} >
            {this.props.children}
          </Paper>
        );
    }

    return (
      <div data-name="VIEWER CONTAINER BOX" style={this.props.boxstyle}>
        {Container}
      </div>
    );
  }
};

/*****************************************************************************/
