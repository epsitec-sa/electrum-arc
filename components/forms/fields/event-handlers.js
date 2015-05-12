'use strict';

var E = require ('e');
var getTextSelection = require ('electrum-utils/modules/get-text-selection.js');

/*****************************************************************************/

var debug = true;

var eventNotify = function eventNotify (obj, event, func) {
  if (event.hasOwnProperty ('target')) {
    func (obj, event);
  }
};

/*
var lastTimeStamp = 0;
var eventFilter = function eventFilter (obj, event, func) {
  if (event.timeStamp > lastTimeStamp) {
    eventNotify (obj, event, func);
    lastTimeStamp = event.timeStamp;
  }
};
*/
/*****************************************************************************/

var processChangeEvent = function (obj, event) {

  var newValue  = event.target.value;
  var newSelect = getTextSelection (event.target);

  if (window.shouldBreak) {
    window.shouldBreak = false;
    //debugger;
  }
  if (debug) {
    var oldValue  = E.getValue (obj);
    var oldSelect = E.getState (obj, 'from,to');

    var oldSelectJson = JSON.stringify (oldSelect);
    var newSelectJson = JSON.stringify (newSelect);

    console.log ('OnChange ' + event.type + ': ' + event.timeStamp);
    console.log ('  Old => ' + oldValue + '/' + oldSelectJson);
    console.log ('  New => ' + newValue + '/' + newSelectJson);
  }

  E.setValue (obj, newValue, newSelect);
};

var processFocusEvent = function (obj, event) {
  if (debug) {
    console.log ('OnFocus ' + event.type + ': ' + event.timeStamp);
  }

  E.bus.dispatch (obj, 'focus');
/*  var proxy = hubs.getPresentationHubProxy ();
  proxy
    .invoke ('FocusField', modelId, fieldId)
    .fail (function (error) {
      trace.log ('FocusField failed: ' + error);
    }); */
};

/*****************************************************************************/

module.exports = {
  handleFocus: function (obj, event) {
    eventNotify (obj, event, processChangeEvent);
    eventNotify (obj, event, processFocusEvent);
    event.stopPropagation ();
  },

  handleChange: function (obj, event) {
    eventNotify (obj, event, processChangeEvent);
    event.stopPropagation ();
    event.preventDefault ();
  },

  handleKeyDown: function (obj, event) {
    eventNotify (obj, event, processChangeEvent);
  },

  handleSelect: function (obj, event) {
    eventNotify (obj, event, processChangeEvent);
  },
};

/*****************************************************************************/
