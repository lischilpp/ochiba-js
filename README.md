## ⚠️ Development Notice

**This repository is under active development and not ready for production yet.**

- Features may change frequently
- Documentation may be incomplete
- Use at your own risk
- You can already try it out on this <a href="https://lischilpp.github.io/ochiba-js/">Interactive Page</a>
- If you want to contribute, feel free to take a look at [<code>☑️ Features TODO</code>](#%EF%B8%8F-features-todo) and create a pull request

# ochiba-js
<p align="center"><img src="res/demo-animation.gif" alt="Demo GIF showing OchibaJS in action" width="400"></p>
<p align="center">
OchibaJS is a lightweight JavaScript library designed to simplify the animation of child elements,<br>
 making it easy to bring your web content to life.<br><br>
The library is built with simplicity in mind, featuring a minimal file size and no external dependencies.
</p>
<p align="center">
  <a href="https://lischilpp.github.io/ochiba-js/">Interactive Page</a>
</p>

### Key Features

- **Flexible Animation Control:** Easily specify the order in which elements animate—whether from first-to-last, from the middle, or in a custom sequence—while controlling key animation properties like duration, delay, and easing, allowing you to create complex animations with just a few lines of code.

- **Text Splitting:** If your element contains text, OchibaJS can automatically split it into individual spans, allowing each letter or word to be animated independently.

- **CSS Export:** The entire animation can be exported as CSS code, allowing you to use it without relying on JavaScript or including the OchibaJS library in your project.

 ## 🗺️ Navigation 
- [<code>📃 Description</code>](#ochiba-js)
- [<code>🤹 Animating child nodes</code>](#animating-child-nodes)
- [<code>⛓️ Animating a chain of elements and their child nodes</code>](#animating-a-chain-of-elements-and-their-child-nodes)
- [<code>⚙️ Animation Options</code>](#animation-options)
- [<code>☑️ Features TODO</code>](#%EF%B8%8F-features-todo)
- [<code>📝 License</code>](#-license)

## Animating child nodes

### Example Usage

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

#### `new OC(element)`

Initializes a new OchibaJS object.

**Parameters:**

- `element` (HTMLElement): The HTML element to which the animation will be applied. <br>
This element can for instance be selected using `document.getElementById()` or `document.querySelector()`.

#### Methods

##### `animateLeaves(options)`

Animates the child nodes of the specified HTML element using the provided options.

**Parameters:**

- `options` (Animation Options Object): An object containing animation configuration options.<br>
  See [<code>⚙️ Animation Options</code>](#animation-options) for details

## Animating a chain of elements and their child nodes

### Example Usage

```javascript
const seq = new OCSequence([
    [{
            root: document.getElementById('headline'),
            animationProps: {
                delay: 0.1,
                order: 'asc',
                timing: 'linear',
                leafAnimation: {
                    duration: 1,
                    delay: 0,
                    timing: 'ease',
                    keyframes: 'headline',
                },
                duration: 1,
            }
        }
    ],
    [{
        root: document.getElementById('sub-headline'),
        animationProps: {
            delay: 0,
            order: 'asc',
            timing: 'linear',
            leafAnimation: {
                duration: 1,
                delay: 0,
                timing: 'ease',
                keyframes: 'sub-headline',
            },
            duration: 1
        }
    }],
])
seq.animate()
```

## Animation Options

- `duration` (number): The duration of the entire animation, in seconds.
- `order` (string): The order in which the leaves will be animated.<br>
  Possible values:
   - `'asc'` (ascending order)
   - `'desc'` (descending order)
   - `'mid-out'` (from middle outwards)
   - `'out-mid'` (from edges inwards)
   - `'random'` (random order)
- `timing` (string): The timing function for the overall animation.<br>
  Possible values:
   - `'linear'` (constant speed)
   - `'ease'` (slow start and end, fast in the middle)
   - `'ease-in'` (slow start)
   - `'ease-out'` (slow end)
   - `'ease-in-out'` (slow start and end)
   - `'cubic-bezier(n,n,n,n)'` (custom cubic-bezier function)
- `leafAnimation` (Object): An object containing the specific animation applied to each child node.<br>
   Possible properties:
   - `keyframes` (string): The keyframes name that define the animation sequence.
   - `duration` (number): The duration of the animation in seconds.
   - `timing` (string): The timing function for the animation.<br> Possible values:
     - `'linear'` (constant speed)
     - `'ease'` (slow start and end, fast in the middle)
     - `'ease-in'` (slow start)
     - `'ease-out'` (slow end)
     - `'ease-in-out'` (slow start and end)
     - `'cubic-bezier(n,n,n,n)'` (custom cubic-bezier function)
   - `delay` (number): The delay before the animation starts in seconds.
   - `iterations` (number): The number of times the animation should repeat.
   - `fillMode` (string): The effect of the animation on the element after it completes.<br> Possible values:
     - `'none'` (default behavior, no styles are applied after the animation ends)
     - `'forwards'` (styles are retained after the animation ends)
     - `'backwards'` (styles are applied from the first keyframe before the animation starts)
     - `'both'` (styles are retained both before and after the animation)

## ☑️ Features TODO
### Make root- and leaf-level animations as similar as possible (like CSS animations)
- [ ] Animation-timing-function steps, step-start, step-end for root level animation
- [ ] Animation-fill-mode none, forwards, backwards, both for root level animation
- [ ] Implementation of values "initial" and "inherit" for root level animations
- [ ] Add support for multiple animations (similar to e.g. animation: rotate 1s, spin 3s, but somehow implemented on both root and leaf level)
### Make the library more stable and correct
- [ ] Check and make durations more exact
(e.g. consider duration of leaf animation: when leaf animation takes 1s to complete and root animation has duration of 8s, the leaf animations should also be finished after 8s.)
- [ ] Check browser support for used language features (e.g. arrow functions. This library should provide support for most common browser that are up to 5 years old.)
- [ ] Group words somehow, that a line break wont't break words in the middle
### Other new features
- [ ] Add support for stopping and re-playing animations
- [ ] Add support for custom order functions (instead of passing things like "mid-out" a custom function can be passed)
- [ ] Clearly state in documentation which features can be exported to CSS and which not
### Improve demos
- [ ] Add syntax highlighting to demo page code, e.g. using prismjs
- [ ] Add GUI with dropdown menus to demo page (e.g. between code editor and load-demos list)
- [ ] Create another demo that is not animating letters or list

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
