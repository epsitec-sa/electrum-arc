'use strict';
import Electrum from 'electrum';
import _Button from './components/buttons/button.component.js';
import _Button$styles from './components/buttons/button.styles.js';
import _AppCanvas from './components/containers/app-canvas.component.js';
import _AppCanvas$styles from './components/containers/app-canvas.styles.js';
import _Container from './components/containers/container.component.js';
import _Container$styles from './components/containers/container.styles.js';
import _Dialog from './components/containers/dialog.component.js';
import _Dialog$styles from './components/containers/dialog.styles.js';
import _Ticket from './components/containers/ticket.component.js';
import _Ticket$styles from './components/containers/ticket.styles.js';
import _DragCab from './components/drag-and-drop/drag-cab.component.js';
import _DragCarrier from './components/drag-and-drop/drag-carrier.component.js';
import _DragController from './components/drag-and-drop/drag-controller.component.js';
import _Badge from './components/extras/badge.component.js';
import _Badge$styles from './components/extras/badge.styles.js';
import _Calendar from './components/extras/calendar.component.js';
import _Calendar$styles from './components/extras/calendar.styles.js';
import _Clock from './components/extras/clock.component.js';
import _Clock$styles from './components/extras/clock.styles.js';
import _FlyingBalloon from './components/extras/flying-balloon.component.js';
import _FlyingBalloon$styles from './components/extras/flying-balloon.styles.js';
import _Gauge from './components/extras/gauge.component.js';
import _Gauge$styles from './components/extras/gauge.styles.js';
import _GoogleFontLoader from './components/extras/google-font-loader.component.js';
import _Separator from './components/extras/separator.component.js';
import _Separator$styles from './components/extras/separator.styles.js';
import _ThemeSwitcher from './components/extras/theme-switcher.component.js';
import _ThemeSwitcher$styles from './components/extras/theme-switcher.styles.js';
import _LabelTextField from './components/forms/fields/label-text-field.component.js';
import _LabelTextField$styles from './components/forms/fields/label-text-field.styles.js';
import _Label from './components/forms/fields/label.component.js';
import _Label$styles from './components/forms/fields/label.styles.js';
import _TextFieldCombo from './components/forms/fields/text-field-combo.component.js';
import _TextFieldCombo$styles from './components/forms/fields/text-field-combo.styles.js';
import _TextField from './components/forms/fields/text-field.component.js';
import _TextField$styles from './components/forms/fields/text-field.styles.js';
import _Layout from './components/layout/layout.component.js';
import _Link from './components/links/link.component.js';
import _Link$styles from './components/links/link.styles.js';
import _Menu from './components/menus/menu.component.js';
import _Menu$styles from './components/menus/menu.styles.js';
import _DispatchBacklog from './components/polypheme/dispatch-backlog.component.js';
import _DispatchDesk from './components/polypheme/dispatch-desk.component.js';
import _DispatchRoadbooks from './components/polypheme/dispatch-roadbooks.component.js';
import _MessengerTicket from './components/polypheme/messenger-ticket.component.js';
import _Notification from './components/polypheme/notification.component.js';
import _Notifications from './components/polypheme/notifications.component.js';
import _Roadbook from './components/polypheme/roadbook.component.js';
import _Roadbook$styles from './components/polypheme/roadbook.styles.js';
import _TicketsTray from './components/polypheme/tickets-tray.component.js';
import _TicketsTray$styles from './components/polypheme/tickets-tray.styles.js';
import _TripBox from './components/polypheme/trip-box.component.js';
import _TripTicket from './components/polypheme/trip-ticket.component.js';
import _TripTickets from './components/polypheme/trip-tickets.component.js';
import _Trip from './components/polypheme/trip.component.js';
import _Splitter from './components/splitter/splitter.component.js';
import _Splitter$styles from './components/splitter/splitter.styles.js';
import _Checkbox from './components/switches/checkbox.component.js';
export const Button = Electrum.wrap ('Button', _Button, {styles: _Button$styles});
export const AppCanvas = Electrum.wrap ('AppCanvas', _AppCanvas, {styles: _AppCanvas$styles});
export const Container = Electrum.wrap ('Container', _Container, {styles: _Container$styles});
export const Dialog = Electrum.wrap ('Dialog', _Dialog, {styles: _Dialog$styles});
export const Ticket = Electrum.wrap ('Ticket', _Ticket, {styles: _Ticket$styles});
export const DragCab = Electrum.wrap ('DragCab', _DragCab);
export const DragCarrier = Electrum.wrap ('DragCarrier', _DragCarrier);
export const DragController = Electrum.wrap ('DragController', _DragController);
export const Badge = Electrum.wrap ('Badge', _Badge, {styles: _Badge$styles});
export const Calendar = Electrum.wrap ('Calendar', _Calendar, {styles: _Calendar$styles});
export const Clock = Electrum.wrap ('Clock', _Clock, {styles: _Clock$styles});
export const FlyingBalloon = Electrum.wrap ('FlyingBalloon', _FlyingBalloon, {styles: _FlyingBalloon$styles});
export const Gauge = Electrum.wrap ('Gauge', _Gauge, {styles: _Gauge$styles});
export const GoogleFontLoader = Electrum.wrap ('GoogleFontLoader', _GoogleFontLoader);
export const Separator = Electrum.wrap ('Separator', _Separator, {styles: _Separator$styles});
export const ThemeSwitcher = Electrum.wrap ('ThemeSwitcher', _ThemeSwitcher, {styles: _ThemeSwitcher$styles});
export const LabelTextField = Electrum.wrap ('LabelTextField', _LabelTextField, {styles: _LabelTextField$styles});
export const Label = Electrum.wrap ('Label', _Label, {styles: _Label$styles});
export const TextFieldCombo = Electrum.wrap ('TextFieldCombo', _TextFieldCombo, {styles: _TextFieldCombo$styles});
export const TextField = Electrum.wrap ('TextField', _TextField, {styles: _TextField$styles});
export const Layout = Electrum.wrap ('Layout', _Layout);
export const Link = Electrum.wrap ('Link', _Link, {styles: _Link$styles});
export const Menu = Electrum.wrap ('Menu', _Menu, {styles: _Menu$styles});
export const DispatchBacklog = Electrum.wrap ('DispatchBacklog', _DispatchBacklog);
export const DispatchDesk = Electrum.wrap ('DispatchDesk', _DispatchDesk);
export const DispatchRoadbooks = Electrum.wrap ('DispatchRoadbooks', _DispatchRoadbooks);
export const MessengerTicket = Electrum.wrap ('MessengerTicket', _MessengerTicket);
export const Notification = Electrum.wrap ('Notification', _Notification);
export const Notifications = Electrum.wrap ('Notifications', _Notifications);
export const Roadbook = Electrum.wrap ('Roadbook', _Roadbook, {styles: _Roadbook$styles});
export const TicketsTray = Electrum.wrap ('TicketsTray', _TicketsTray, {styles: _TicketsTray$styles});
export const TripBox = Electrum.wrap ('TripBox', _TripBox);
export const TripTicket = Electrum.wrap ('TripTicket', _TripTicket);
export const TripTickets = Electrum.wrap ('TripTickets', _TripTickets);
export const Trip = Electrum.wrap ('Trip', _Trip);
export const Splitter = Electrum.wrap ('Splitter', _Splitter, {styles: _Splitter$styles});
export const Checkbox = Electrum.wrap ('Checkbox', _Checkbox);
