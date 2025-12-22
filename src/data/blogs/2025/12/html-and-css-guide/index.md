---
title: HTML and CSS Guide
pubDate: 2025-12-22
author: Melner Dz
slug: html-and-css-guide
image:
  src: ./main.png
  alt: HTML & CSS Guide cover
description: A concise, example-driven guide to HTML elements, CSS syntax, properties, values, and common patterns for building clean UI.
technology:
  - HTML
  - CSS
tags:
  - guide
  - reference
  - webdev
---

**Overview**

- **Goal:** Practical reference for common HTML elements and CSS patterns.
- **Covers:** Elements, attributes, selectors, properties, values, pseudo-classes, box model, and text styles.

**HTML Basics**

- **Button and paragraph:**

```html
<button>Hello</button>
<p>This is a paragraph of text</p>
```

**HTML Syntax**

- **Whitespace:** HTML collapses multiple spaces into one inside most elements.
- **Readable formatting:**

```html
<p>
  This paragraph spans multiple lines but renders as a single block of text.
</p>
```

**Attributes**

- **Link with target:**

```html
<a href="https://youtube.com" target="_blank">Link to YouTube</a>
```

**CSS Basics**

- **Select elements and style:**

```css
button {
  background-color: red;
  color: white;
}
```

**CSS Syntax**

- **Selector:** what to style.
- **Property:** what aspect to change.
- **Value:** the setting for that property.

```css
button {
  background-color: red;
}
```

**CSS Properties**

- **Common button styles:**

```css
button {
  background-color: red;
  color: white;
  height: 36px;
  width: 105px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
```

- **Borders:**

```css
button.primary {
  border: 1px solid red; /* width style color */
}
```

**CSS Values**

- **Lengths:** `px`, `rem`, `%`.
- **Colors:** named, hex `#ff0000`, `rgb(255,0,0)`, `hsl(0 100% 50%)`.
- **Timing:** `s`, `ms` for animations/transitions.

**Class Attributes**

- **Reuse styles with classes:**

```html
<button class="subscribe-button">SUBSCRIBE</button>
<button class="subscribe-button">JOIN</button>
```

```css
.subscribe-button {
  background: red;
  color: #fff;
}
```

- **Multiple classes:**

```html
<button class="youtube-button subscribe-button">SUBSCRIBE</button>
```

**Pseudo-classes**

- **Hover and active states:**

```css
.subscribe-button:hover {
  opacity: 0.9;
}
.subscribe-button:active {
  transform: scale(0.98);
}
```

**Intermediate CSS**

- **Transitions:**

```css
.subscribe-button {
  transition:
    background-color 0.15s,
    color 0.15s;
}
```

- **Shadows:**

```css
.card {
  box-shadow: 3px 4px 5px rgba(0, 0, 0, 0.15);
}
```

**Chrome DevTools**

- Inspect elements, live-edit styles, and measure layout with the Box Model panel.

**CSS Box Model**

- **Margin, padding, border:**

```css
.join.button {
  margin: 10px 20px; /* top/bottom left/right */
  padding: 10px 20px; /* top/bottom left/right */
  border: 1px solid red;
}
```

**Text Styles**

- **Typography:**

```css
.title {
  font-family: Roboto, Verdana, Arial;
  font-size: 30px;
  font-weight: 700; /* bold */
  font-style: italic;
  text-align: center;
  line-height: 24px;
  text-decoration: underline;
}

p {
  margin: 0 0 16px;
}
```

**HTML Structure**

```html
<!doctype html>
<html>
  <head>
    <title>Title in the tab</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <!-- Visible content goes here -->
  </body>
</html>
```

**Images**

```html
<img src="pics/image.png" alt="Description of the image" />
```

```css
.image {
  object-fit: cover;
  object-position: bottom;
}
```

**Inputs**

```html
<input type="text" placeholder="Search" class="search-bar" />
<input type="checkbox" />
```

```css
.search-bar::placeholder {
  font-size: 30px;
}
```

**Display Property**

```css
.element {
  display: inline; /* or block, inline-block, flex, grid */
}
```

**Reference**

- MDN Web Docs: HTML, CSS.
- Web.dev: Best practices and performance.
