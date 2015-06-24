# Map

Display an Open Street Map powered by Leafletjs.
A default layers set is defined.
 
## Usage:

```jsx
<Map />
<Map lat={46.52342} lon={6.63855}/>
```

## Map Properties

By default:
The map is centered on Lausanne city (CH)
Keyboard is enabled
Zoom control is disabled
attributions is disabled

### lat=number

Initial latitude

### lon=number

Initial longitude

### zoom=number

Zoom level (17 by default)

### keyboard=bool

Enable keyboard

### zoomControl=bool

Display zoom control

### attributionControl=bool

Display attributions (copyrights) on layers
