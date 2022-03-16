import { createComponent, html } from "../../utils/mm.js";

createComponent({
  name: "form-template",

  data: ({ dataset }) => {
    if (!dataset.next) throw new Error('"data-next" is required');

    return {
      theme: dataset.theme || "light",
      cancel: dataset.cancel || null,
      submit: dataset.submit,
      title: dataset.title,
    };
  },

  render: (data) => {
    const { theme, title, next, prev } = data;

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

    const prevHtml = html`
      <button-element data-to=${prev} data-theme="${theme}"
        >Back</button-element
      >
    `;

    return html`
      ${style}
      <div class="wrapper">
        ${title && titleHtml}

        <main>
          <slot></slot>

          <div class="actions">
            ${prev && prevHtml}

            <button-element
              data-importance="primary"
              data-theme="${theme}"
              data-to="${next}"
              >Continue</button-element
            >
          </div>
        </main>
      </div>
    `;
  },
});
