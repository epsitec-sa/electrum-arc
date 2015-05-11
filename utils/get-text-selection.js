'use strict';

/*****************************************************************************/

module.exports = function getTextSelection (el) {
  // http://stackoverflow.com/questions/12194113

  var start = 0, end = 0;
  var normalizedValue, range, textInputRange, len, endRange;

  if (('selectionStart' in el) &&
      ((/text|password|search|tel|url/).test (el.type)) &&
      (typeof el.selectionStart === 'number') &&
      (typeof el.selectionEnd === 'number')) {

    start = el.selectionStart;
    end   = el.selectionEnd;

  } else {

    range = document.selection && document.selection.createRange ();

    if (range && range.parentElement () === el) {
      len = el.value.length;
      normalizedValue = el.value.replace (/\r\n/g, '\n');

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange ();
      textInputRange.moveToBookmark (range.getBookmark ());

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange ();
      endRange.collapse (false);

      if (textInputRange.compareEndPoints ('StartToEnd', endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart ('character', -len);
        start += normalizedValue.slice (0, start).split ('\n').length - 1;

        if (textInputRange.compareEndPoints ('EndToEnd', endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd ('character', -len);
          end += normalizedValue.slice (0, end).split ('\n').length - 1;
        }
      }
    }
  }

  return {id: el.id, from: start, to: end};
};

/*****************************************************************************/
