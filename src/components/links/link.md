# Link

Link provides functionality like `<a href="...">...</a>` elements.

## Usage:

Basic:

```jsx
<Link href="http://www.google.com" />
<Link id="OpenProfile" />
<Link action="OpenProfile" />
```

In <Menu>:

```jsx
<Menu title="Electrum Starter">
  <Link id="start" />
  <Link id="info"  />
  <Link id="kung"  />
  <Link id="foo"   />
</Menu>
```

## Link Properties

Link support actions dispatching like <Button />

### id=

Will dispatch id value on electrum bus.

### action=

Same as id but more explicit.

### href=

Set the native href attribute on element

## Kinds

* `kind="*menu-item*"` change typo for <Menu> items
* `kind="*menu-heading*"` change typo for <Menu> heading
