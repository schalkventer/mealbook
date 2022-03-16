import { createComponent, html } from "../../utils/mm.js";

const STYLE_MAP = {
  light: {
    primary: {
      border: "rgba(var(--color-green), var(--opacity-none))",
      background: "rgba(var(--color-green), var(--opacity-solid))",
      color: "rgba(var(--color-white), var(--opacity-solid))",
      shadow: "var(--shadow-medium)",
      hover: "rgba(var(--color-green), var(--opacity-strong))",
    },
    secondary: {
      border: "rgba(var(--color-green), var(--opacity-solid))",
      background: "rgba(var(--color-green), var(--opacity-none))",
      color: "rgba(var(--color-green), var(--opacity-solid))",
      shadow: "var(--shadow-medium)",
      hover: "rgba(var(--color-green), var(--opacity-sutble))",
    },
  },
  dark: {
    primary: {
      border: "rgba(var(--color-white), var(--opacity-none))",
      background: "rgba(var(--color-white), var(--opacity-solid))",
      color: "rgba(var(--color-green), var(--opacity-solid))",
      shadow: "var(--shadow-none)",
      hover: "rgba(var(--color-white), var(--opacity-strong))",
    },
    secondary: {
      border: "rgba(var(--color-white), var(--opacity-solid))",
      background: "rgba(var(--color-white), var(--opacity-none))",
      color: "rgba(var(--color-white), var(--opacity-solid))",
      shadow: "var(--shadow-none)",
      hover: "rgba(var(--color-white), var(--opacity-subtle))",
    },
  },
};

createComponent({
  name: "button-element",

  data: ({ dataset }) => ({
    importance: dataset.importance || "secondary",
    theme: dataset.theme || "light",
    to: dataset.to || null,
    form: dataset.form || null,
  }),

  render: (data) => {
    const { importance, theme, to, form } = data;

    const style = html`
      <style>
        button,
        a {
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: var(--spacing-m);
          font: var(--font-l);
          letter-spacing: var(--font-spacing-l);
          text-transform: uppercase;
          cursor: pointer;
          transform: translateY(0);
          border-radius: var(--radius-subtle);
          border: 1px solid;

          background: ${STYLE_MAP[theme][importance].background};
          color: ${STYLE_MAP[theme][importance].color};
          shadow: ${STYLE_MAP[theme][importance].shadow};
        }

        button:hover,
        a:hover {
          background: ${STYLE_MAP[theme][importance].hover};
        }

        button:active,
        a:active {
          transform: translateY(1px);
          box-shadow: var(--shadow-none);
        }
      </style>
    `;

    if (to) {
      return html`
        ${style}
        <a href="${to}"><slot></slot></a>
      `;
    }

    return html`
      ${style}
      <button form="content"><slot></slot></button>
    `;
  },
});
