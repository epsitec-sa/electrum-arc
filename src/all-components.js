'use strict';
import Electrum from 'electrum';
import _BasicField from './components/forms/fields/basic-field.component.js';
import _BasicField$styles from './components/forms/fields/basic-field.styles.js';
import _Label from './components/forms/fields/label.component.js';
import _Label$styles from './components/forms/fields/label.styles.js';
export const BasicField = Electrum.wrap ('BasicField', _BasicField, {styles: _BasicField$styles});
export const Label = Electrum.wrap ('Label', _Label, {styles: _Label$styles});
