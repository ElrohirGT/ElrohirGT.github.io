/**
 * @typedef {Object} TypingOptions
 * @property {number} duration - The per character animation duration.
 * @property {number} delay - The initial animation delay.
 */

/**
 * @typedef {Object} HTMLBuilder
 * @property {()=>HTMLElement} build - Constructs the HTML node element.
 * @property {(propertyName: string, propertyValue: string)=>HTMLBuilder} setProperty - Sets a property inside an HTML element
 * @property {(parent: HTMLElement)=>HTMLElement} setParent - Adds the element as a child of the supplied DOM element and constructs it.
 * @property {(text: string)=>HTMLBuilder} addTextNode - Adds a text node to the HTML element.
 * @property {(style: CSSStyleDeclaration)=>HTMLBuilder} style - Add CSS styles to this element.
 * @property {(text: string, options: TypingOptions, style: CSSStyleDeclaration)=>HTMLBuilder} addAnimatedTextNode - Add a typing animated text node.
 */

/**
 * Builder for an HTMLElement.
 * @param {string} tag - The HTML tag to create an element of.
 * @returns {HTMLBuilder} An HTMLElement builder
 */
export const createElement = (tag) => {
  const nativeElem = document.createElement(tag);
  const wrapper = {
    setProperty: (propertyName, propertyValue) => {
      nativeElem.setAttribute(propertyName, propertyValue);
      return wrapper;
    },
    setParent: (parent) => {
      parent.appendChild(nativeElem);
      return wrapper.build();
    },
    addTextNode: (text) => {
      const textNode = document.createTextNode(text);
      nativeElem.appendChild(textNode);
      return wrapper;
    },
    addAnimatedTextNode: (text, options, style = {}) => {
      const { delay, duration } = options;
      const chars = text.split("");
      chars.forEach((c, idx) => {
        createElement("span")
          .style({
            ...style,
            display: "inline-block", // So the animation applies
            whiteSpace: "pre", // So it displays whitespace
            transform: "scaleY(0)", // So it starts without appearing on the screen.

            animationName: "Typing",
            animationDelay: `${delay + idx * duration}s`,
            animationDuration: `${duration}s`,
            animationFillMode: "forwards",
          })
          .addTextNode(c)
          .setParent(nativeElem);
      });

      return wrapper;
    },
    style: (styles) => {
      Object.assign(nativeElem.style, styles);
      return wrapper;
    },
    build: () => nativeElem,
  };
  return wrapper;
};

/**
 * Converts a number into a CSS pixel string.
 * @param {number} quantity
 */
export const toPixelsString = (quantity) => `${quantity}px`;

/**
 * @param {number} ms - The number of milliseconds to wait
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
