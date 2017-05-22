import Electrum from 'electrum';
import _ButtonClose from './components/buttons/button-close.component.js';
import _Button from './components/buttons/button.component.js';
import _Button$styles from './components/buttons/button.styles.js';
import _CheckButton from './components/buttons/check-button.component.js';
import _Combo from './components/combo/combo.component.js';
import _Combo$styles from './components/combo/combo.styles.js';
import _DialogModal from './components/combo/dialog-modal.component.js';
import _DialogModal$styles from './components/combo/dialog-modal.styles.js';
import _AppCanvas from './components/containers/app-canvas.component.js';
import _AppCanvas$styles from './components/containers/app-canvas.styles.js';
import _Container from './components/containers/container.component.js';
import _Container$styles from './components/containers/container.styles.js';
import _Dialog from './components/containers/dialog.component.js';
import _Dialog$styles from './components/containers/dialog.styles.js';
import _Footer from './components/containers/footer.component.js';
import _Footer$styles from './components/containers/footer.styles.js';
import _Ticket from './components/containers/ticket.component.js';
import _Ticket$styles from './components/containers/ticket.styles.js';
import _Repeat from './components/control-flow/repeat.component.js';
import _DragCab from './components/drag-and-drop/drag-cab.component.js';
import _DragCapsule from './components/drag-and-drop/drag-capsule.component.js';
import _DragCarrier from './components/drag-and-drop/drag-carrier.component.js';
import _ChronoBar from './components/events/chrono-bar.component.js';
import _ChronoBar$styles from './components/events/chrono-bar.styles.js';
import _ChronoEvent from './components/events/chrono-event.component.js';
import _ChronoEvent$styles from './components/events/chrono-event.styles.js';
import _ChronoLabel from './components/events/chrono-label.component.js';
import _ChronoLabel$styles from './components/events/chrono-label.styles.js';
import _ChronoLine from './components/events/chrono-line.component.js';
import _ChronoLine$styles from './components/events/chrono-line.styles.js';
import _Chronos from './components/events/chronos.component.js';
import _Chronos$styles from './components/events/chronos.styles.js';
import _Event from './components/events/event.component.js';
import _Events from './components/events/events.component.js';
import _Events$styles from './components/events/events.styles.js';
import _Badge from './components/extras/badge.component.js';
import _Badge$styles from './components/extras/badge.styles.js';
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
import _TextFieldTyped from './components/forms/fields/text-field-typed.component.js';
import _TextField from './components/forms/fields/text-field.component.js';
import _TextField$styles from './components/forms/fields/text-field.styles.js';
import _Layout from './components/layout/layout.component.js';
import _Link from './components/links/link.component.js';
import _Link$styles from './components/links/link.styles.js';
import _Menu from './components/menus/menu.component.js';
import _Menu$styles from './components/menus/menu.styles.js';
import _CodispatchDragTicket from './components/polypheme/codispatch-drag-ticket.component.js';
import _CodispatchTicket from './components/polypheme/codispatch-ticket.component.js';
import _DispatchBacklog from './components/polypheme/dispatch-backlog.component.js';
import _DispatchChronos from './components/polypheme/dispatch-chronos.component.js';
import _DispatchChronos1 from './components/polypheme/dispatch-chronos1.component.js';
import _DispatchChronos2 from './components/polypheme/dispatch-chronos2.component.js';
import _DispatchDesk from './components/polypheme/dispatch-desk.component.js';
import _DispatchDragTicket from './components/polypheme/dispatch-drag-ticket.component.js';
import _DispatchEvents from './components/polypheme/dispatch-events.component.js';
import _DispatchMessengers from './components/polypheme/dispatch-messengers.component.js';
import _DispatchRoadbooks from './components/polypheme/dispatch-roadbooks.component.js';
import _DispatchTable1 from './components/polypheme/dispatch-table1.component.js';
import _DispatchTable2 from './components/polypheme/dispatch-table2.component.js';
import _DispatchTicket from './components/polypheme/dispatch-ticket.component.js';
import _DispatchTrips from './components/polypheme/dispatch-trips.component.js';
import _GlyphsDialog from './components/polypheme/glyphs-dialog.component.js';
import _GlyphsDialog$styles from './components/polypheme/glyphs-dialog.styles.js';
import _MessengerCombo from './components/polypheme/messenger-combo.component.js';
import _MessengerModify from './components/polypheme/messenger-modify.component.js';
import _MessengerTicket from './components/polypheme/messenger-ticket.component.js';
import _Notification from './components/polypheme/notification.component.js';
import _Notifications from './components/polypheme/notifications.component.js';
import _Roadbook from './components/polypheme/roadbook.component.js';
import _Roadbook$styles from './components/polypheme/roadbook.styles.js';
import _TicketsTray from './components/polypheme/tickets-tray.component.js';
import _TicketsTray$styles from './components/polypheme/tickets-tray.styles.js';
import _TripCombo from './components/polypheme/trip-combo.component.js';
import _TripDeliver from './components/polypheme/trip-deliver.component.js';
import _TripModify from './components/polypheme/trip-modify.component.js';
import _TripPredispatch from './components/polypheme/trip-predispatch.component.js';
import _Route from './components/router/route.component.js';
import _Router from './components/router/router.component.js';
import _View from './components/router/view.component.js';
import _Splitter from './components/splitter/splitter.component.js';
import _Splitter$styles from './components/splitter/splitter.styles.js';
import _Checkbox from './components/switches/checkbox.component.js';
import _TableRow from './components/table/table-row.component.js';
import _TableRow$styles from './components/table/table-row.styles.js';
import _Table from './components/table/table.component.js';
import _Table$styles from './components/table/table.styles.js';
import _Calendar from './components/time/calendar.component.js';
import _Calendar$styles from './components/time/calendar.styles.js';
import _Clock from './components/time/clock.component.js';
import _Clock$styles from './components/time/clock.styles.js';
import _Glyph from './components/time/glyph.component.js';
import _Glyph$styles from './components/time/glyph.styles.js';
import _Glyphs from './components/time/glyphs.component.js';
import _Glyphs$styles from './components/time/glyphs.styles.js';
import _Note from './components/time/note.component.js';
import _Note$styles from './components/time/note.styles.js';
import _Notes from './components/time/notes.component.js';
import _Notes$styles from './components/time/notes.styles.js';
import _Recurrence from './components/time/recurrence.component.js';
import _Recurrence$styles from './components/time/recurrence.styles.js';
import _Recurrences from './components/time/recurrences.component.js';
import _Recurrences$styles from './components/time/recurrences.styles.js';
export const ButtonClose = Electrum.wrap ('ButtonClose', _ButtonClose);
export const Button = Electrum.wrap ('Button', _Button, {styles: _Button$styles});
export const CheckButton = Electrum.wrap ('CheckButton', _CheckButton);
export const Combo = Electrum.wrap ('Combo', _Combo, {styles: _Combo$styles});
export const DialogModal = Electrum.wrap ('DialogModal', _DialogModal, {styles: _DialogModal$styles});
export const AppCanvas = Electrum.wrap ('AppCanvas', _AppCanvas, {styles: _AppCanvas$styles});
export const Container = Electrum.wrap ('Container', _Container, {styles: _Container$styles});
export const Dialog = Electrum.wrap ('Dialog', _Dialog, {styles: _Dialog$styles});
export const Footer = Electrum.wrap ('Footer', _Footer, {styles: _Footer$styles});
export const Ticket = Electrum.wrap ('Ticket', _Ticket, {styles: _Ticket$styles});
export const Repeat = Electrum.wrap ('Repeat', _Repeat);
export const DragCab = Electrum.wrap ('DragCab', _DragCab);
export const DragCapsule = Electrum.wrap ('DragCapsule', _DragCapsule);
export const DragCarrier = Electrum.wrap ('DragCarrier', _DragCarrier);
export const ChronoBar = Electrum.wrap ('ChronoBar', _ChronoBar, {styles: _ChronoBar$styles});
export const ChronoEvent = Electrum.wrap ('ChronoEvent', _ChronoEvent, {styles: _ChronoEvent$styles});
export const ChronoLabel = Electrum.wrap ('ChronoLabel', _ChronoLabel, {styles: _ChronoLabel$styles});
export const ChronoLine = Electrum.wrap ('ChronoLine', _ChronoLine, {styles: _ChronoLine$styles});
export const Chronos = Electrum.wrap ('Chronos', _Chronos, {styles: _Chronos$styles});
export const Event = Electrum.wrap ('Event', _Event);
export const Events = Electrum.wrap ('Events', _Events, {styles: _Events$styles});
export const Badge = Electrum.wrap ('Badge', _Badge, {styles: _Badge$styles});
export const FlyingBalloon = Electrum.wrap ('FlyingBalloon', _FlyingBalloon, {styles: _FlyingBalloon$styles});
export const Gauge = Electrum.wrap ('Gauge', _Gauge, {styles: _Gauge$styles});
export const GoogleFontLoader = Electrum.wrap ('GoogleFontLoader', _GoogleFontLoader);
export const Separator = Electrum.wrap ('Separator', _Separator, {styles: _Separator$styles});
export const ThemeSwitcher = Electrum.wrap ('ThemeSwitcher', _ThemeSwitcher, {styles: _ThemeSwitcher$styles});
export const LabelTextField = Electrum.wrap ('LabelTextField', _LabelTextField, {styles: _LabelTextField$styles});
export const Label = Electrum.wrap ('Label', _Label, {styles: _Label$styles});
export const TextFieldCombo = Electrum.wrap ('TextFieldCombo', _TextFieldCombo, {styles: _TextFieldCombo$styles});
export const TextFieldTyped = Electrum.wrap ('TextFieldTyped', _TextFieldTyped);
export const TextField = Electrum.wrap ('TextField', _TextField, {styles: _TextField$styles});
export const Layout = Electrum.wrap ('Layout', _Layout);
export const Link = Electrum.wrap ('Link', _Link, {styles: _Link$styles});
export const Menu = Electrum.wrap ('Menu', _Menu, {styles: _Menu$styles});
export const CodispatchDragTicket = Electrum.wrap ('CodispatchDragTicket', _CodispatchDragTicket);
export const CodispatchTicket = Electrum.wrap ('CodispatchTicket', _CodispatchTicket);
export const DispatchBacklog = Electrum.wrap ('DispatchBacklog', _DispatchBacklog);
export const DispatchChronos = Electrum.wrap ('DispatchChronos', _DispatchChronos);
export const DispatchChronos1 = Electrum.wrap ('DispatchChronos1', _DispatchChronos1);
export const DispatchChronos2 = Electrum.wrap ('DispatchChronos2', _DispatchChronos2);
export const DispatchDesk = Electrum.wrap ('DispatchDesk', _DispatchDesk);
export const DispatchDragTicket = Electrum.wrap ('DispatchDragTicket', _DispatchDragTicket);
export const DispatchEvents = Electrum.wrap ('DispatchEvents', _DispatchEvents);
export const DispatchMessengers = Electrum.wrap ('DispatchMessengers', _DispatchMessengers);
export const DispatchRoadbooks = Electrum.wrap ('DispatchRoadbooks', _DispatchRoadbooks);
export const DispatchTable1 = Electrum.wrap ('DispatchTable1', _DispatchTable1);
export const DispatchTable2 = Electrum.wrap ('DispatchTable2', _DispatchTable2);
export const DispatchTicket = Electrum.wrap ('DispatchTicket', _DispatchTicket);
export const DispatchTrips = Electrum.wrap ('DispatchTrips', _DispatchTrips);
export const GlyphsDialog = Electrum.wrap ('GlyphsDialog', _GlyphsDialog, {styles: _GlyphsDialog$styles});
export const MessengerCombo = Electrum.wrap ('MessengerCombo', _MessengerCombo);
export const MessengerModify = Electrum.wrap ('MessengerModify', _MessengerModify);
export const MessengerTicket = Electrum.wrap ('MessengerTicket', _MessengerTicket);
export const Notification = Electrum.wrap ('Notification', _Notification);
export const Notifications = Electrum.wrap ('Notifications', _Notifications);
export const Roadbook = Electrum.wrap ('Roadbook', _Roadbook, {styles: _Roadbook$styles});
export const TicketsTray = Electrum.wrap ('TicketsTray', _TicketsTray, {styles: _TicketsTray$styles});
export const TripCombo = Electrum.wrap ('TripCombo', _TripCombo);
export const TripDeliver = Electrum.wrap ('TripDeliver', _TripDeliver);
export const TripModify = Electrum.wrap ('TripModify', _TripModify);
export const TripPredispatch = Electrum.wrap ('TripPredispatch', _TripPredispatch);
export const Route = Electrum.wrap ('Route', _Route);
export const Router = Electrum.wrap ('Router', _Router);
export const View = Electrum.wrap ('View', _View);
export const Splitter = Electrum.wrap ('Splitter', _Splitter, {styles: _Splitter$styles});
export const Checkbox = Electrum.wrap ('Checkbox', _Checkbox);
export const TableRow = Electrum.wrap ('TableRow', _TableRow, {styles: _TableRow$styles});
export const Table = Electrum.wrap ('Table', _Table, {styles: _Table$styles});
export const Calendar = Electrum.wrap ('Calendar', _Calendar, {styles: _Calendar$styles});
export const Clock = Electrum.wrap ('Clock', _Clock, {styles: _Clock$styles});
export const Glyph = Electrum.wrap ('Glyph', _Glyph, {styles: _Glyph$styles});
export const Glyphs = Electrum.wrap ('Glyphs', _Glyphs, {styles: _Glyphs$styles});
export const Note = Electrum.wrap ('Note', _Note, {styles: _Note$styles});
export const Notes = Electrum.wrap ('Notes', _Notes, {styles: _Notes$styles});
export const Recurrence = Electrum.wrap ('Recurrence', _Recurrence, {styles: _Recurrence$styles});
export const Recurrences = Electrum.wrap ('Recurrences', _Recurrences, {styles: _Recurrences$styles});
