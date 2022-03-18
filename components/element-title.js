import { createComponent, html } from "../../utils/mm.js";

const SIZE_MAP = {
  s: "l",
  m: "xl",
  l: "xxl",
};

createComponent({
  name: "element-title",

  data: (node) => {
    const { dataset } = node;
    if (!dataset.level) throw new Error('"data-level" is required');
    const level = parseInt(dataset.level);

    const isValidLevel = level >= 1 && level <= 6;
    if (!isValidLevel)
      throw new Error('"data-level" is required to be between 1 and 6');

    const size = dataset.size || "m";
    if (!["s", "m", "l"].includes(size))
      throw new Error('"data-size" is required to be "s", "m" or "l"');

    const theme = dataset.theme || "light";
    if (!["light", "dark"].includes(theme))
      throw new Error('"data-theme" is required to be "light" or "dark"');

    return {
      level,
      size,
      theme,
    };
  },

  render: ({ level, size, theme }) => {
    const tag = `h${level}`;

    return html`
            <style>
                h1, h2, h3, h4, h5, h6 {
                    margin: 0;
                    color: rgb(var(--color-${
                      theme === "dark" ? "white" : "black"
                    }));
                    font: var(--font-${SIZE_MAP[size]});
                }
            </style>
            <${tag}><slot></slot></${tag}>
        `;
  },
});
