# FlexBox

FlexBox create a flex layout container and inject
flex properties to childs.

## Usage:

Create a row flex layout container:
```jsx
<FlexBox direction='row'>
  <ArcComponent>A</ArcComponent>
  <ArcComponent>B</ArcComponent>
  <ArcComponent>C</ArcComponent>
</FlexBox>
```

## Flex Properties

Setup you FlexBox container with props:

### direction=

* row (default)
* row-reverse
* column
* column-reverse

### wrap=

* no (default)
* yes
* reverse

### justify=

* start (default)
* end
* center
* space-a
* space-b

### align-items=

* baseline
* center
