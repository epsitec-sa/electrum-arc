'use strict';
import {BasicList} from './basic-list.component.js';
import {SelectableContainerEnhance as selectable} from 'material-ui/lib/hoc/selectable-enhance';

/******************************************************************************/

let SelectableList = selectable (BasicList);
export default SelectableList;
