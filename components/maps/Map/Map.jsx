'use strict';

var React   = require ('react');
var E       = require ('e');
var Leaflet = require ('leaflet');
require ('leaflet/dist/leaflet.css');

/*****************************************************************************/

module.exports = {

  theme: require ('./Map.styles.js'),

  propTypes: {
    keyboard: React.PropTypes.bool,
    zoomControl: React.PropTypes.bool,
    attributionControl: React.PropTypes.bool,
    lat: React.PropTypes.number,
    lon: React.PropTypes.number,
    zoom: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      keyboard: true,
      zoomControl: false,
      attributionControl: false,
      lat: 46.52342,
      lon: 6.63855,
      zoom: 17
    };
  },

  componentDidMount: function () {
    if (this.props.createMap) {
        this.map = this.props.createMap (this.getDOMNode ());
    } else {
        this.map = this.createMap (this.getDOMNode ());
    }
    this.setupMap ();
  },

  setupMap: function () {
    this.map.setView ([this.props.lat, this.props.lon], this.props.zoom);
  },

  createMap: function (element) {
    var bicycleLayer = Leaflet.tileLayer (
      'http://{s}.tile.osmdb.ch/bicycle2/{z}/{x}/{y}.png'
    );
    var tonerMap = Leaflet.tileLayer (
      'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
    );
    var cycleMap = Leaflet.tileLayer (
      'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
    );
    var lightMap = Leaflet.tileLayer (
      'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    );
    var darkMap  = Leaflet.tileLayer (
      'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
    );

    var baseMaps = {
      Toner: tonerMap,
      Dark: darkMap,
      Light: lightMap,
      CycleMap: cycleMap
    };

    var overlayMaps = {
      Bicycle: bicycleLayer
    };

    var map = Leaflet.map (element, {
      keyboard: this.props.keyboard,
      zoomControl: this.props.zoomControl,
      attributionControl: this.props.attributionControl
    });

    darkMap.addTo(map);

    bicycleLayer.addTo (map).setOpacity (0.55);

    Leaflet.control.layers (baseMaps, overlayMaps).addTo(map);

    return map;
  },

  render: function () {
    var style    = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);
    if (disabled) {
      style.push ({
        color: E.palette.disabledColor
      });
    }
    return (
      <div style={style}>
      </div>
    );
  }

};

/*****************************************************************************/
