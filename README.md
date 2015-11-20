# PostCSS Media Queries drop redundant

[PostCSS] plugin to delete redundant media query declarations

[PostCSS]: https://github.com/postcss/postcss

```css
/* Input example */
@media (min-width: 300px) {
    .foo {
        color: red;
    }
}

@media (min-width: 500px) {
    .foo {
        color: red;
        padding: 10px;
    }
}

@media (max-width: 1200px) {
    .foo {
        color: blue;
        height: 100px;
    }
}

@media (max-width: 900px) {
    .foo {
        color: red;
        height: 100px;
    }
}

```

```css
/* Output example */
@media (min-width: 300px) {
    .foo {
        color: red;
    }
}

@media (min-width: 500px) {
    .foo {
        padding: 10px;
    }
}

@media (max-width: 1200px) {
    .foo {
        color: blue;
        height: 100px;
    }
}

@media (max-width: 900px) {
    .foo {
        color: red;
    }
}
```

## Usage

```js
var mqdr = require('postcss-media-queries-drop-redundant');
postcss([mqdr])
```

See [PostCSS] docs for examples for your environment.
