import { createComponent, html, createList } from "../../utils/mm.js";

const optionsList = createList(({ name, selected }) => {
    return html`<option value="${name}" ${selected && 'selected'}>${name}</option>`
})

const attributesList = createList(({ name, values }) => {
  if (!values) return html`
    <label>
      <span>${name}</span>
      <input data-key="attribute-change">
    </label>
  `

  const innerOptionsList = createList((option) => {
    return html`<option value="${option.name}">${option.name}</option>`
  })

  return html`
    <label>
      <span>${name}</span>
      <select data-key="attribute-change">${innerOptionsList(values)}</select>
    </label>
  `
})

const ATTRIBUTES = [
  {
    "name": "data-to",
    "description": "Link to page"
  },
  {
    "name": "data-importance",
    "description": "Visual salience",
    "values": [{ "name": "secondary"}, { "name": "primary" }, ]
  }
]

createComponent({
  name: "template-demo",

  data: (node) => {
    const items = Array.from(node.querySelectorAll("li"));
    const components = items.map(({ dataset }) => ({ name: dataset.component, position: dataset.position || 'bottom' }));

    return {
      components,
      active: components[0].name,
      show: true,
      slot: '',
      attributes: {}
    };
  },

  handlers: {
    change: ({ target }, { active }) => {
      const { value } = target

      if (target.dataset.key === 'components' && active !== value) {
        return {
          active: value,
        }
      }
    },

    input: ({ target }) => {
      if (target.dataset.key === 'slot') {
        return {
          slot: target.value,
        }
      }
    },

    click: ({ target }, data) => {
      if (target.dataset.key === 'show') {
        return {
          show: !data.show,
        }
      }
    }
  },

  render: ({ components, active, slot, show }, _, shadow) => {
    const { position } = components.find(item => item.name === active)
    const options = components.map(item => ({ ...item, selected: active === item.name}))

    shadow.innerHTML = html`
      <style>
        .floating {
          position: fixed;
          left: 0;
          width: 100%;
          display: none;
          z-index: 1000;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }

        .floating.top {
          bottom: auto;
          top: 0;
        }

        .floating.bottom {
          bottom: 0;
          top: auto;
        }

        .floating.show {
          display: block;
        }

        .content {
          background: black;
          padding: 1rem;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .button {
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          z-index: 1001;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }

        .attributes {
          background: #333;
          padding: 1rem;
          color: white;
          font-size: 0.7rem;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }

        .display {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;          
        }
      </style>

      <div class="display">
        <element-button></element-button>
      </div>

      <button class="button" data-key="show"></button>

      <div class="floating show">
        <div class="attributes">
          <label>
            <span>slot</span>
            <input data-key="slot" value="${slot}">
          </label>

          ${attributesList(ATTRIBUTES)}
        </div>

        <div class="content">
          <select data-key="components">${optionsList(options)}</select>
        </div>
      </div>
    `;

    // return html`
    
  },
});
