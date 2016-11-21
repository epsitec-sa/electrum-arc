'use strict';

import React from 'react';

import {Ticket, Container, Label, Note} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class TripTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      extended: false,
      selected: false,
      hatch:    false,
    };
  }

  getExtended () {
    return this.state.extended;
  }

  setExtended (value) {
    this.setState ( {
      extended: value
    });
  }

  getSelected () {
    return this.state.selected;
  }

  setSelected (value) {
    this.setState ( {
      selected: value
    });
  }

  getHatch () {
    return this.state.hatch;
  }

  setHatch (value) {
    this.setState ( {
      hatch: value
    });
  }

  getGlyph (glyph, description, indexKey) {
    if (glyph.startsWith ('bookmark-')) {
      const color = glyph.substring (9);
      return (
        <Note key={indexKey} glyph='bookmark' glyph-color={color} z-index={11}
          tooltip={description} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Note key={indexKey} glyph={glyph} z-index={11}
          tooltip={description} spacing='compact' {...this.link ()} />
      );
    }
  }

  getGlyphs (glyphs) {
    if (!glyphs) {
      return null;
    } else {
      let line = [];
      let indexKey = 0;
      glyphs.forEach (glyph => {
        if (glyph && glyph.value && glyph.value.Glyph) {
          line.push (this.getGlyph (glyph.value.Glyph, glyph.value.Description, indexKey++));
        }
      });
      return line;
    }
  }

  getTime (time) {
    if (time && time.length === 19) {
      // If format '2016-03-31T14:30:00', extract 'hh:mm'.
      let h = time.substring (11, 13);
      let m = time.substring (14, 16);
      time = h + ':' + m;
    }
    return time;
  }

  // mouseClick (event) {
  //   if (event.ctrlKey) {
  //     this.setSelected (!this.getSelected ());
  //   } else if (event.altKey) {
  //     this.setHatch (!this.getHatch ());
  //   } else {
  //     this.setExtended (!this.getExtended ());
  //   }
  // }

  mouseClick (event) {
    if (event.ctrlKey) {
      this.setSelected (!this.getSelected ());
    } else if (event.altKey) {
      this.setHatch (!this.getHatch ());
    } else {
      this.setExtended (!this.getExtended ());
    }
  }

  //  Compute the approximative number of lines for a text.
  computeLineCount (line) {
    return Math.ceil (line.length / 17);
  }

  computeHeight (extended, text) {
    if (extended) {
      let count = 1;
      const lines = text.split ('\\n');
      lines.forEach (line => {
        count += this.computeLineCount (line);
      });
      return Unit.multiply ('20px', count);
    } else {
      const count = text.split ('\\n').length + 1;
      return Unit.multiply ('20px', count);
    }
  }

  render () {
    const width    = '250px';
    // const selected = this.read ('Selected');
    const extended = this.getExtended ();
    const selected = this.getSelected ();
    const hatch    = this.getHatch ();
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const color    = data.Color;
    const type     = data.Type ? data.Type : 'xxx';
    const noDrag   = data.NoDrag;
    const ticketId = this.read ('ticket-id');
    const tripId   = this.read ('trip-id');

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      throw new Error ('TripTicket without data');
    } else {
      const trip              = (type === 'pick') ? data.Trip.Pick : data.Trip.Drop;
      const time              = trip.Time;
      const description       = extended ? trip.Details : trip.Description;
      const descriptionWeight = extended ? null : 'bold';
      const descriptionSize   = extended ? this.props.theme.shapes.ticketExtendedTextSize : this.props.theme.shapes.ticketCompactTextSize;
      const descriptionWrap   = extended ? 'yes' : 'no';
      const directionGlyph    = (type === 'pick') ?
                                  ((trip.Type === 'transit') ? 'circle-o' : 'circle') :
                                  ((trip.Type === 'transit') ? 'square-o' : 'square');
      const directionColor    = ColorHelpers.GetMarkColor (this.props.theme, type);
      const directionDesc     = (type === 'pick') ? 'Pick (prise en charge)' : 'Drop (livraison)';
      const glyphs            = trip.Glyphs;
      const height            = Unit.add (this.computeHeight (extended, description), '20px');
      const marginBottom      = extended ? null : '-10px';
      const cursor            = (noDrag === 'true') ? null : 'move';

      return (
        <Ticket width={width} height={height} selected={selected ? 'true' : 'false'}
          kind={kind} subkind={type} color={color}
          drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} hatch={hatch ? 'true' : 'false'}
          ticket-type='trip-ticket' ticket-id={ticketId} trip-id={tripId}
          extended={extended ? 'true' : 'false'}
          onMouseClick={(e) => this.mouseClick (e)}
          {...this.link ()} >
          <Container kind='ticket-column' grow='1' {...this.link ()} >
            <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
              <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
              <Note glyph={directionGlyph} glyph-color={directionColor} tooltip={directionDesc}
                width='25px' z-index={11} {...this.link ()} />
              <Label text={description} font-weight={descriptionWeight} font-size={descriptionSize}
                wrap={descriptionWrap} grow='1' {...this.link ()} />
            </Container>
            <Container kind='ticket-row' {...this.link ()} >
              <Label text='' width='75px' {...this.link ()} />
              <Label glyph='cube' spacing='compact' {...this.link ()} />
              <Label text={data.Trip.Count} grow='1' {...this.link ()} />
              {this.getGlyphs (glyphs)}
            </Container>
          </Container>
        </Ticket>
      );
    }
  }
}

/******************************************************************************/
