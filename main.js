import { createElement, delay } from "src/lib.mjs";
import "./index.css";
import "unfonts.css";
import { renderHelpCommand } from "src/helpCommand.mjs";
import { renderAboutMeCommand } from "src/aboutMeCommand.mjs";
import { renderExperienceCommand } from "src/experienceCommand.mjs";
import { renderProjectsCommand } from "src/projectsCommand.mjs";
import wallpaper from "src/imgs/1_wallpaper.jpg";

const DIGITS_AND_LETTERS = "abcdefghijklmnñopqrstuvwxyz"
  .split("")
  .flatMap((c) => [c, c.toLocaleUpperCase()])
  .concat(..."1234567890 ".split(""));

console.log(DIGITS_AND_LETTERS);

const preloadImages = async () => {
  const siteImages = await import.meta.glob("./src/imgs/**/*.(jpg|png|webp)");
  const promises = [];
  for (const key in siteImages) {
    promises.push(siteImages[key]());
  }

  const preLoadImage = (href) => {
    createElement("link")
      .setProperty("rel", "preload")
      .setProperty("as", "image")
      .setProperty("href", href)
      .setParent(document.body);
  };
  preLoadImage(wallpaper); // Start loading the background first!
  const modules = await Promise.all(promises);
  modules.map((m) => m.default).forEach(preLoadImage);
};

preloadImages();

/** @type string[] */
let commandHistory = [];
let commandBuffer = "";

/** Clears the command buffer from any input */
function clearCommandBuffer() {
  commandBuffer = "";
}

/**
 * Booting up the OS animation
 */
async function bootingAnimation(
  initialDelayMs,
  inBetweenBlockDelay,
  perCharDelayMs,
) {
  await delay(initialDelayMs);
  const animationOptions = {
    delay: 0,
    duration: perCharDelayMs / 1000,
  };

  const renderNormalLine = (text) => {
    createElement("p")
      .addAnimatedTextNode(text, animationOptions)
      .setParent(document.querySelector("body"));
    return (
      text.length * animationOptions.duration * 1000 +
      animationOptions.delay * 1000
    );
  };

  const renderLoadingLine = async (text, loadingMs, shouldFail = false) => {
    const container = createElement("p").setParent(document.body);
    createElement("span").addTextNode("[ ").setParent(container);
    const statusElem = createElement("span")
      .addAnimatedTextNode("Loading", animationOptions, { color: "yellow" })
      .setParent(container);
    createElement("span").addTextNode(" ] ").setParent(container);

    createElement("span")
      .addAnimatedTextNode(text, animationOptions)
      .setParent(container);

    await delay(
      loadingMs +
        animationOptions.duration * 1000 * text.length +
        animationOptions.delay * 1000,
    );

    statusElem.style.color = shouldFail ? "red" : "lightgreen";
    statusElem.textContent = shouldFail ? "ERROR" : "OK";
  };

  await delay(renderNormalLine("Starting version 2003.08.07.flaviOS"));
  await delay(inBetweenBlockDelay);

  await delay(renderNormalLine("/dev/sda2: Recovering journal"));
  await delay(inBetweenBlockDelay);

  await delay(
    renderNormalLine(
      "/dev/sda2: clean, 236168/3055616 files, 12203008/12207104 blocks",
    ),
  );
  await delay(inBetweenBlockDelay);

  await delay(await renderLoadingLine("Loading skills", 600));
  await delay(inBetweenBlockDelay);

  await delay(await renderLoadingLine("Loading projects", 500));
  await delay(inBetweenBlockDelay);

  await delay(await renderLoadingLine("Loading embarassing photos", 600, true));
  await delay(600);

  document.body.replaceChildren();
}

/**
 * Function that represents a command the user can input
 *
 * @callback TerminalCommandLambda
 * @param {HTMLElement} [resultElement=undefined] resultElement
 * @param {...string} args
 * @returns {void}
 */

/**
 * A command that can be run inside the terminal emulator
 *
 * @typedef {Object} TerminalCommand
 * @property {TerminalCommandLambda} function
 * @property {string[]} usageInfo
 */

export const AVAILABLE_COMMANDS = {
  /** @type {TerminalCommandLambda} */
  help: {
    function: renderHelpCommand,
    usageInfo: ["Usage: help", "Displays this command block again."],
  },
  /** @type {TerminalCommandLambda} */
  clear: {
    function: () => {
      document.body.replaceChildren();
    },
    usageInfo: ["Usage: clear", "Clears the console."],
  },
  /**@type {TerminalCommandLambda}*/
  aboutMe: {
    function: renderAboutMeCommand,
    usageInfo: [
      "Usage: aboutMe",
      "Displays some extra information about who I am.",
    ],
  },
  /**@type {TerminalCommandLambda}*/
  experience: {
    function: renderExperienceCommand,
    usageInfo: [
      "Usage: experience",
      "Displays information regarding my technical experience.",
    ],
  },
  /**@type {TerminalCommandLambda}*/
  projects: {
    function: renderProjectsCommand,
    usageInfo: [
      "Usage: projects",
      "Displays informations regarding personal projects I've worked on.",
    ],
  },
};

(async () => {
  await bootingAnimation(300, 100, 25);
  createElement("img")
    .setProperty("src", wallpaper)
    .style({
      position: "absolute",
      top: "50%",
      left: "50%",
      display: "inline-block",
      width: "fit-content",
      maxWidth: "70%",
      maxHeight: "70%",
      opacity: "0.1",
      transform: "translate(-50%, -50%)",
      objectFit: "cover",
      zIndex: "-1",
    })
    .setParent(document.body);

  /**
   * @typedef {Object} HTMLState
   * @property {HTMLElement} lineElement
   * @property {HTMLElement} resultElement
   * @property {HTMLElement} cursorElement
   */

  let windowState = createEmptyCommandBlock();

  /**
   * @typedef {Object} InputMessage
   * @property {string} buffer
   */
  /**
   * @typedef {Object} ExecuteCommandMessage
   * @property {string} command
   * @property {string[]} args
   */

  /**
   * @typedef {InputMessage|ExecuteCommandMessage} Message
   */

  /**
   * Renders the terminal interface according to the state supplied.
   * Should only change window state and not application state.
   * @param {Message} message
   */
  function renderDisplay(message) {
    console.log("Rendering message: ", message);
    if (message.buffer !== undefined) {
      /** @type InputMessage */
      const { buffer } = message;
      windowState.lineElement.textContent = buffer;

      const scrollOptions = {
        left: 0,
        top: document.body.scrollHeight,
        behavior: "smooth",
      };
      window.scrollBy(scrollOptions);
    }

    if (message.command !== undefined) {
      /** @type ExecuteCommandMessage */
      const { command, args } = message;

      if (AVAILABLE_COMMANDS[command] !== undefined) {
        AVAILABLE_COMMANDS[command].function(
          windowState.resultElement,
          ...args,
        );
      } else {
        createElement("p")
          .addTextNode(
            `Unknown command: \`${command}\`. Type \`help\` to get a list of all the available commands`,
          )
          .setParent(windowState.resultElement);
      }
      windowState.cursorElement.remove();
      windowState = createEmptyCommandBlock();

      const scrollOptions = {
        left: 0,
        top: document.body.scrollHeight,
        behavior: "smooth",
      };
      window.scrollBy(scrollOptions);
    }
  }
  /**
   * @param {number} initialDelayMs
   * @param {number} perCharDelayMs
   */
  async function helpAnimation(initialDelayMs, perCharDelayMs) {
    await delay(initialDelayMs);

    renderDisplay({ buffer: "h" });
    await delay(perCharDelayMs);

    renderDisplay({ buffer: "he" });
    await delay(perCharDelayMs);

    renderDisplay({ buffer: "hel" });
    await delay(perCharDelayMs);

    renderDisplay({ buffer: "help" });
    await delay(perCharDelayMs);

    renderDisplay({ command: "help", args: [] });
    acceptsUserInput = true;
  }
  helpAnimation(300, 200);

  /**
   * @param {HTMLElement} [parent=document.querySelector("body")]
   * @returns {HTMLState} An collection of HTMLElements that represents the most current state of elements to change
   */
  function createEmptyCommandBlock(parent = document.querySelector("body")) {
    const animatableCursorStyles = {
      animation: "1.1s linear 0s infinite alternate both running CursorBlink",
      backgroundColor: "#e86f25",
      width: ".8rem",
      height: "1.5rem",
    };

    const commandBlockElem = createElement("div")
      .style({
        display: "flex",
        flexDirection: "column",
      })
      .setParent(parent);
    const commandInputContainer = createElement("div")
      .style({
        display: "flex",
      })
      .setParent(commandBlockElem);
    createElement("p")
      .style({
        color: "#e86f25",
        fontWeight: "bold",
        paddingRight: "1rem",
      })
      .addTextNode("$")
      .setParent(commandInputContainer);

    const lineElement = createElement("p").setParent(commandInputContainer);
    const cursorElement = createElement("span")
      .style(animatableCursorStyles)
      .setParent(commandInputContainer);
    const resultElement = createElement("div").setParent(commandBlockElem);

    return {
      lineElement,
      resultElement,
      cursorElement,
    };
  }

  let acceptsUserInput = false;

  /**
   * Keyboard event listener.
   * Should only change values of the state of the application and not window state.
   */
  document.addEventListener("keydown", (event) => {
    if (!acceptsUserInput) {
      return;
    }

    // Autocomplete command if exists
    if (event.key === "Tab") {
      event.preventDefault();
      const autocompleteRest = Object.keys(AVAILABLE_COMMANDS)
        .filter((commandName) => commandName.startsWith(commandBuffer))
        .map((commandName) => commandName.slice(commandBuffer.length))
        .reduce((inCommon, commandEnd) => {
          if (inCommon === undefined) {
            return commandEnd;
          }

          let lastCommonCharIndex = inCommon.length - 1;
          for (let i = 0; i < inCommon.length; i++) {
            if (inCommon[i] !== commandEnd[i]) {
              lastCommonCharIndex = i - 1;
            }
          }

          return inCommon.slice(0, lastCommonCharIndex + 1);
        }, undefined);

      commandBuffer += autocompleteRest ?? "";
      renderDisplay({ buffer: commandBuffer });

      // Escape to return to normal mode
    } else if (event.key === "Escape") {
      console.log("Escape was pressed!");

      // Press enter to execute a command
    } else if (event.key === "Enter") {
      const parts = commandBuffer.split(" ");
      renderDisplay({ command: parts[0], args: parts.slice(1) });
      clearCommandBuffer();

      // Press backspace to delete a character
    } else if (event.key === "Backspace" && commandBuffer.length > 0) {
      commandBuffer = commandBuffer.slice(0, commandBuffer.length - 1);
      renderDisplay({ buffer: commandBuffer });

      // Press CTRL-C to delete current command
    } else if (event.key === "c" && event.ctrlKey) {
      clearCommandBuffer();
      renderDisplay({ buffer: commandBuffer });

      // Press CTRL-L to clear screen
    } else if (event.ctrlKey && event.key === "l") {
      event.preventDefault();
      renderDisplay({ command: "clear", args: [] });
      renderDisplay({ buffer: commandBuffer });

      // Press any other key to input to buffer
    } else if (DIGITS_AND_LETTERS.includes(event.key)) {
      commandBuffer += event.key;
      renderDisplay({ buffer: commandBuffer });
    }
  });
})();
