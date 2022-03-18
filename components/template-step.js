import { createComponent, html } from "../../utils/mm.js";

createComponent({
  name: "template-step",

  data: ({ dataset }) => {
    if (!dataset.primary) throw new Error('"data-primary" is required');

    if (dataset.secondaryUrl && !dataset.secondary) throw new Error('"data-" is required');

    return {
      theme: dataset.theme || "light",
      primary: dataset.primary,
      next: dataset.next,
      title: dataset.title,
    };
  },

  render: (data) => {
    const { theme, title, secondary, primary } = data;

    const style = html`
      <style>
        .wrapper {
          background: rgb(var(--color-${theme === "dark" ? "green" : "white"}));
          min-height: 100vh;
        }

        header {
          padding: 2rem 2rem 1rem;
          text-align: center;
        }

        main {
          padding: 1rem 2rem 4rem;
        }

        .actions {
          border-top: 1px solid
            rgba(
              var(--color-${theme === "dark" ? "white" : "black"}),
              var(--opacity-${theme === "dark" ? "medium" : "subtle"})
            );
          position: fixed;
          bottom: 0;
          left: 0;
          display: flex;
          width: 100%;
          padding: 0.25rem;
          justify-content: center;
        }

        button-element {
          width: 50%;
          margin: 0.25rem;
        }
      </style>
    `;

    const titleHtml = html`
      <header>
        <title-element data-level="1" data-size="l" data-theme="${theme}"
          >${title}
        </title-element>
      </header>
    `;

    const secondaryHtml = html`
      <button-element
        ${primaryUrl && `href="${primaryUrl}"`}data-theme="${theme}"
        >Cancel</button-element
      >
    `;

    return html`
      ${style}
      <div class="wrapper">
        ${title && titleHtml}

        <main>
          <form id="content">
            <slot></slot>
          </form>

          <div class="actions">
            ${prev && secondaryHtml}

            <button-element
              data-importance="primary"
              data-theme="${theme}"
              data-form="content"
              form="content"
              >Save</button-element
            >
          </div>
        </main>
      </div>
    `;
  },
});
