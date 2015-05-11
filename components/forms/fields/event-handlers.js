'use strict';

var E = require ('e');
var getTextSelection = require ('../../../utils/get-text-selection.js');

/*****************************************************************************/

var lastEventTimeStamp = 0;

var processChangeEvent = function (event) {

  var oldValue  = E.getValue (this);
  var oldSelect = E.getState (this, 'from,id,to'); // TODO: remove id

  var newValue  = event.target.value;
  var newSelect = getTextSelection (event.target);

  var oldSelectJson = JSON.stringify (oldSelect);
  var newSelectJson = JSON.stringify (newSelect);

  lastEventTimeStamp = event.timeStamp;

  console.log ('OnChange ' + event.type + ': ' + event.timeStamp);
  console.log ('Old: ' + oldValue + '/' + oldSelectJson);
  console.log ('New: ' + newValue + '/' + newSelectJson);

  if ((oldValue !== newValue) ||
      (oldSelectJson !== newSelectJson)) {

    E.setValueAndStates (this, newValue, [newSelect]);
  }
};
/*
var processFocusEvent = function (event) {
  var fieldId = event.target.id;
  var store  = this.getStore ();
  if (store.isHandlingFocus) {
    trace.log ('Skipping OnFocus');
    return;
  }
  store.isHandlingFocus = true;
  var modelId = store.modelId;

  trace.log ('OnFocus ' + fieldId + ', ' + modelId);
  event.stopPropagation ();
  var proxy = hubs.getPresentationHubProxy ();
  proxy
    .invoke ('FocusField', modelId, fieldId)
    .fail (function (error) {
      trace.log ('FocusField failed: ' + error);
    });
};
*/
/*****************************************************************************/

module.exports = {
/*
  handleFocus: function (event) {
    if (event.target.id) {
      if (event.timeStamp > lastEventTimeStamp) {
        processChangeEvent.call (this, event);
      }
      processFocusEvent.call (this, event);
    }
  },
*/
  handleChange: function (event) {
    if (event.target.id) {
      processChangeEvent.call (this, event);
      event.stopPropagation ();
      event.preventDefault ();
    }
  },
/*
  handleKeyDown: function (event) {
    if (event.target.id) {
      if (event.timeStamp > lastEventTimeStamp) {
        processChangeEvent.call (this, event);
      }
    }
  },

  handleSelect: function (event) {
    if (event.target.id) {
      if (event.timeStamp > lastEventTimeStamp) {
        processChangeEvent.call (this, event);
      }
    }
  }*/
};

/*****************************************************************************/
