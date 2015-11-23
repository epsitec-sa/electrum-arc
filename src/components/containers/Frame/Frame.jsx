'use strict';

var React = require ('react');

/*****************************************************************************/

module.exports = {

    componentDidMount: function () {
      this.renderFrameContents ();
    },

    componentDidUpdate: function() {
      this.renderFrameContents ();
    },

    componentWillUnmount: function() {
      React.unmountComponentAtNode (
        React.findDOMNode (this).contentDocument.body
      );
    },

    render: function () {
      return React.createElement('iframe', this.props);
    },

    renderFrameContents: function () {
      var doc = React.findDOMNode (this).contentDocument;
      var cssLink = document.createElement ('link');
      cssLink.href = this.props.css;
      cssLink.rel  = 'stylesheet';
      cssLink.type = 'text/css';
      doc.head.appendChild(cssLink);
      if(doc && doc.readyState === 'complete') {
        var contents = React.createElement('div',
          undefined,
          this.props.children
        );

        React.render (contents, doc.body);
      } else {
        window.setTimeout (this.renderFrameContents, 0);
      }
    },



};

/*****************************************************************************/
