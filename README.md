# ochiba-js
![Demo GIF](res/demo-animation.gif)
OchibaJS is a lightweight JavaScript library designed to simplify the animation of child elements, making it easy to bring your web content to life. The library is built with simplicity in mind, featuring a minimal file size and no external dependencies.

### Key Features

- **Text Splitting:** If your element contains text, OchibaJS can automatically split it into individual spans, allowing each letter or word to be animated independently.

- **Flexible Animation Control:** You can easily control various animation properties such as duration, delay, and easing, enabling the creation of complex animations with just a few lines of code.

- **CSS Export:** The entire animation can be exported as CSS code, allowing you to use it without relying on JavaScript or including the OchibaJS library in your project.

 [Interactive Page](https://lischilpp.github.io/ochiba-js/)

 ## 🗺️ Navigation 
- [<code>📝 Animating child nodes</code>](#-animating-child-nodes)
- [<code>📝 Example usage</code>](#-example-usage)
- [<code>📝 License</code>](#-license)

## Animating child nodes

#### `new OC(element)`

Creates a new instance of the `OC` class.

**Parameters:**

- `element` (HTMLElement): The HTML element to which the animation will be applied. This element is typically selected using `document.getElementById()`.

#### Methods

##### `animateLeaves(options)`

Animates the child nodes of the specified HTML element using the provided options.

**Parameters:**

- `options` (Options Object): An object containing animation configuration options.

## Options Object Properties

- `duration` (number): The duration of the entire animation, in seconds.
- `order` (string): The order in which the leaves will be animated. Acceptable values are `'asc'` (ascending) or `'desc'` (descending).
- `timing` (string): The timing function for the overall animation. Common values include `'linear'`, `'ease'`, `'ease-in'`, etc.
- `leafAnimation` (Object): An object containing the specific animation details for each individual leaf.

**LeafAnimation Object Properties:**

- `duration` (number): The duration of the animation for each individual leaf, in seconds.
- `timing` (string): The timing function for the leaf animation. Common values include `'linear'`, `'ease'`, etc.
- `keyframes` (string): The name of the keyframes animation to apply to each leaf. Example: `'wave-from-left'`.

## Example Usage

```javascript
// Get the HTML element with ID 'h1'
const elem = document.getElementById('h1');

// Create a new OC instance
const oc = new OC(elem);

// Animate leaves on the element
oc.animateLeaves({
    duration: 1,
    order: 'asc',
    timing: 'linear',
    leafAnimation: {
        duration: 1,
        timing: 'ease',
        keyframes: 'wave-from-left'
    },
});
```

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
