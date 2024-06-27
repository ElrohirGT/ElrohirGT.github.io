import "./styles.css";
import { createElement, toPixelsString } from "src/lib.mjs";

/**
 * @returns {HTMLElement} - The section slide element
 */
export const buildSlide = () => {
  const foxPixelWidth = 500;
  const foxPixelHeight = 500;

  const slide = createElement("section").build();
  const container = createElement("div")
    .setProperty("class", "twoColumnsContainer")
    .setParent(slide);

  /** @type CSSStyleDeclaration */
  const foxElemCommonStyles = {
    gridColumn: "1/2",
    gridRow: "1/2",
    width: toPixelsString(foxPixelWidth),
    height: toPixelsString(foxPixelHeight),
  };

  // Fox animation
  const foxContainer = createElement("div")
    .setProperty("id", "foxContainer")
    .style({
      width: toPixelsString(foxPixelWidth),
      height: toPixelsString(foxPixelHeight),
      display: "grid",
      gridTemplateRows: "1fr",
      gridTemplateColumns: "1fr",
      justifyItems: "center",
      alignItems: "center",
      transition: "all 1s",
    })
    .setParent(container);

  // Backdrop
  createElement("div")
    .style({
      ...foxElemCommonStyles,
      clipPath:
        "polygon(41% 32%, 59% 32%, 84% 1%, 79% 51%, 90% 76%, 50% 99%, 10% 76%, 21% 51%, 16% 1%)",
      backgroundColor: "black",
    })
    .setParent(foxContainer);

  // Fox face
  createElement("div")
    .style({
      ...foxElemCommonStyles,
      clipPath:
        "polygon(40% 37%, 59% 37%, 80% 10%, 74% 51%, 85% 75%, 50% 94%, 15% 75%, 26% 51%, 20% 10%)",
      backgroundColor: "#ff6332",
    })
    .setParent(foxContainer);

  // Fox chin
  createElement("div")
    .style({
      ...foxElemCommonStyles,
      backgroundColor: "white",
      clipPath: "polygon(15% 75%, 33% 70%, 50% 90%, 68% 70%, 85% 75%, 50% 94%)",
    })
    .setParent(foxContainer);

  // Fox Nose
  createElement("div")
    .style({
      ...foxElemCommonStyles,
      backgroundColor: "black",
      clipPath: "polygon(45.8% 85%, 54.8% 85%, 50% 90%)",
    })
    .setParent(foxContainer);

  // Left ear
  createElement("div")
    .style({
      ...foxElemCommonStyles,
      backgroundColor: "black",
      clipPath: "polygon(23% 18%, 30% 48%, 38% 38%)",
    })
    .setParent(foxContainer);

  // Right ear
  createElement("div")
    .style({
      ...foxElemCommonStyles,
      backgroundColor: "black",
      clipPath: "polygon(77% 18%, 70% 48%, 62% 38%)",
    })
    .setParent(foxContainer);

  createElement("div")
    .style(foxElemCommonStyles)
    .setProperty("id", "leftEye")
    .setParent(foxContainer);
  createElement("div")
    .style(foxElemCommonStyles)
    .setProperty("id", "rightEye")
    .setParent(foxContainer);

  // About Me
  const aboutMeContainer = createElement("div")
    .style({
      display: "flex",
      flexDirection: "column",
    })
    .setParent(container);
  createElement("h1").addTextNode("Flavio Galán").setParent(aboutMeContainer);
  createElement("h2")
    .addTextNode("Eternal student, mobile and fullstack developer")
    .setParent(aboutMeContainer);
  const quoteContainer = createElement("div")
    .style({
      justifySelf: "center",
      padding: "1rem",
      backgroundColor: "#0F0C1D",
    })
    .setParent(aboutMeContainer);
  createElement("blockquote")
    .addTextNode(
      "The illiterate of the twenty-first century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.",
    )
    .setParent(quoteContainer);
  createElement("p").addTextNode("~ Alvin Toffler").setParent(quoteContainer);

  return slide;
};
