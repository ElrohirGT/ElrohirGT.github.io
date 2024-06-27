import { createElement } from "src/lib.mjs";
import linkIcon from "@tabler/icons/outline/link.svg";
import sanitasHome from "src/imgs/sanitasHome.png";
import nixosBlogsHome from "src/imgs/nixosBlogsHome.png";
import awsLambdaIcon from "src/imgs/logos/awslambda-logo.png";
import awsSamIcon from "src/imgs/logos/awssam-logo.png";
import awsApiGatewayIcon from "src/imgs/logos/awsapigateway-logo.png";
import postgresIcon from "src/imgs/logos/postgresql-logo.png";
import awsCognitoIcon from "src/imgs/logos/awscognito-logo.png";
import reactIcon from "src/imgs/logos/react-logo.webp";
import nixIcon from "src/imgs/logos/nix-logo.png";
import expressIcon from "src/imgs/logos/express-logo.webp";
import chessyBanner from "src/imgs/chessyBanner.png";
import rustIcon from "src/imgs/logos/rust-logo.png";
import vueIcon from "src/imgs/logos/vue-logo.webp";

export const renderProjectsCommand = (resultElement) => {
  const container = createElement("div")
    .style({
      display: "flex",
      flexDirection: "column-reverse",
      gap: "1rem",
    })
    .setParent(resultElement);

  /**
   * @typedef {Object} Project
   * @property {string} url
   * @property {string} banner
   * @property {string} description
   * @property {Object} stack
   */

  const projects = [
    {
      name: "Sanitas",
      url: "https://sanitasuvg.github.io/Sanitas/",
      banner: sanitasHome,
      description:
        "Medical record managment software designed for the UVG Clinic. Built to scale with the UVG community.",
      stack: {
        PostgreSQL: {
          url: "https://www.postgresql.org/",
          icon: postgresIcon,
        },
        SAM: {
          url: "https://aws.amazon.com/serverless/sam/",
          icon: awsSamIcon,
        },
        Lambda: {
          url: "https://aws.amazon.com/pm/lambda/",
          icon: awsLambdaIcon,
        },
        ApiGateway: {
          url: "https://aws.amazon.com/es/api-gateway/",
          icon: awsApiGatewayIcon,
        },
        Cognito: {
          url: "https://aws.amazon.com/pm/cognito/",
          icon: awsCognitoIcon,
        },
        React: {
          url: "https://es.react.dev/",
          icon: reactIcon,
        },
        Nix: {
          url: "https://nixos.org/",
          icon: nixIcon,
        },
      },
    },

    {
      name: "NixOS Blogs",
      url: "https://nixos-blogs.up.railway.app/",
      banner: nixosBlogsHome,
      description: "Easy to digest blogs to learn Nix!",
      stack: {
        PostgreSQL: {
          url: "https://www.postgresql.org/",
          icon: postgresIcon,
        },
        ExpressJS: {
          url: "https://expressjs.com/",
          icon: expressIcon,
        },
        React: {
          url: "https://es.react.dev/",
          icon: reactIcon,
        },
        Nix: {
          url: "https://nixos.org/",
          icon: nixIcon,
        },
      },
    },

    {
      name: "Chessy",
      url: "https://github.com/ElrohirGT/Chessy",
      banner: chessyBanner,
      description:
        "A chess game built from scratch for playing with friends online!",
      stack: {
        Rust: {
          url: "https://www.rust-lang.org/",
          icon: rustIcon,
        },
        Vue: {
          url: "https://vuejs.org/",
          icon: vueIcon,
        },
        Nix: {
          url: "https://nixos.org/",
          icon: nixIcon,
        },
      },
    },
  ];

  const entryAnimationDuration = 0.5;
  const inBetweenDelay = 0.02;
  let delay = 0;

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const isOdd = i % 2 === 0;
    const slideContainer = createElement("div")
      .style({
        display: "flex",
        width: "100%",
        gap: "1rem",
      })
      .setParent(container);

    if (isOdd) {
      delay += displayTechStack(slideContainer, project, {
        delay,
        duration: entryAnimationDuration,
        name: "SlideIn_Right",
      });
      delay += inBetweenDelay;

      delay += displayProjectBanner(slideContainer, project, {
        delay,
        duration: entryAnimationDuration,
        name: "SlideIn_Right",
      });
    } else {
      delay += entryAnimationDuration + inBetweenDelay;
      const bannerAnimDuration = displayProjectBanner(slideContainer, project, {
        delay,
        duration: entryAnimationDuration,
        name: "SlideIn_Left",
      });

      delay -= entryAnimationDuration + inBetweenDelay;
      delay += displayTechStack(slideContainer, project, {
        delay,
        duration: entryAnimationDuration,
        name: "SlideIn_Left",
      });

      delay += bannerAnimDuration;
    }

    delay += inBetweenDelay;
  }
};

/**
 * Creates an animation property for the slides to entry.
 * @param {number} delay - The number of seconds to wait before starting the animation.
 * @param {number} duration - The duration of the animation in seconds.
 * @param {string} name - The animation name.
 * @returns {string} The constructed animation string
 */
const createAnimationStyle = (delay, duration, name) =>
  `${duration}s ease-out ${delay}s 1 normal forwards running ${name}`;

/**
 * @param {HTMLElement} container - The HTML element container for displaying the tech stack
 * @param {Project} project - The project information
 * @param {{delay: number, duration: number, name: string}} animationInfo - The info for the entry animation
 * @returns {number} The amount of seconds to wait for all animations to finish on this display.
 */
const displayProjectBanner = (container, project, animationInfo) => {
  const { delay, duration, name } = animationInfo;

  const bannerContainer = createElement("a")
    .style({
      transform: "translateX(1000%)",
      display: "inline-grid",
      gridTemplateColumns: "100%",
      gridTemplateRows: "100%",
      width: "90%",
      height: "100%",
      textDecoration: "none",
      animation: createAnimationStyle(delay, duration, name),
    })
    .setProperty("href", project.url)
    .setProperty("target", "_blank")
    .setParent(container);

  createElement("img")
    .style({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      gridRow: "1/2",
      gridColumn: "1/2",
    })
    .setProperty("src", project.banner)
    .setParent(bannerContainer);
  const descriptionContainer = createElement("div")
    .style({
      gridRow: "1/2",
      gridColumn: "1/2",
      width: "100%",
      height: "10rem",
      backgroundColor: "rgba(14,20,25,0.9)",
      alignSelf: "end",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
    })
    .setParent(bannerContainer);
  const titleElem = createElement("h1")
    .style({
      display: "inline-block",
      color: "#42affa",
    })
    .addTextNode(project.name)
    .setParent(descriptionContainer);
  createElement("img")
    .style({
      height: "3rem",
      filter: "invert(.5) sepia(1) saturate(5) hue-rotate(175deg)",
    })
    .setProperty("src", linkIcon)
    .setParent(titleElem);
  createElement("p")
    .style({
      width: "40%",
      textAlign: "center",
    })
    .addTextNode(project.description)
    .setParent(descriptionContainer);

  return duration;
};

/**
 * @param {HTMLElement} container - The HTML element container for displaying the tech stack
 * @param {Project} project - The project information
 * @param {{delay: number, duration: number, name: string}} animationInfo - The info for the entry animation
 * @returns {number} The amount of seconds to wait for all animations to finish on this display.
 */
const displayTechStack = (container, project, animationInfo) => {
  const { delay, duration, name } = animationInfo;

  const techStackContainer = createElement("div")
    .style({
      transform: "translateX(10000%)",
      display: "flex",
      animation: createAnimationStyle(delay, duration, name),
    })
    .setParent(container);

  const techIconsContainer = createElement("div")
    .style({
      display: "flex",
      gap: "2rem",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "2rem",
      backgroundColor: "#262b30",
    })
    .setParent(techStackContainer);

  for (const techName in project.stack) {
    const tech = project.stack[techName];

    const link = createElement("a")
      .style({
        position: "relative",

        height: `${100 / Object.keys(project.stack).length}%`,
        aspectRatio: "1/1",
        maxHeight: "4rem",
        maxWidth: "4rem",
      })
      .setProperty("href", tech.url)
      .setProperty("target", "_blank")
      .setParent(techIconsContainer);

    createElement("img")
      .style({
        width: "100%",
        height: "100%",
        objectFit: "cover",
      })
      .setProperty("src", tech.icon)
      .setParent(link);

    const hintElem = createElement("span")
      .style({
        display: "none",
        position: "absolute",
        top: "50%",
        left: "110%",
        transform: "translateY(-50%)",
        padding: ".5rem",
        backgroundColor: "#0e1419",
      })
      .addTextNode(techName)
      .setParent(link);

    link.addEventListener("mouseenter", () => {
      hintElem.style.display = "inline-block";
    });
    link.addEventListener("mouseleave", () => {
      hintElem.style.display = "none";
    });
  }

  return duration;
};
