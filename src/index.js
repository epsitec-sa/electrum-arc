'use strict';

import {E} from 'electrum';
import components from './all-components.js';

E.components = components;

components.eventHandlers = require ('./event-handlers.js');
module.exports = components;
