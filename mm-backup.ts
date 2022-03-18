export const createComponent = (props) => {
  const { name, init, render, handlers = {} } = props;
  if (!name) throw new Error('"name" is required');

  if (!/\-/.test(name))
    throw new Error('"name" requires a hypen ("-") in the value.');

  const listeners = Object.keys(handlers);

  class Component extends HTMLElement {
    shadow = this.attachShadow({ mode: "closed" });
    data = {}
    elements = {}
    template = ''

    constructor() {
      super();
      const { template, data } = init(this)
      this.data = data || {}
      this.template = template
    }

    update(newData) {
      const prev = { ...this.data };
      const merged = { ...this.data, ...newData };
      this.data = merged;

      render(this.shadow, merged, prev);
    }

    connectedCallback() {
      listeners.forEach((eventType) => {
        this.shadow.addEventListener(eventType, this.handlerWrapper);
      });

      this.shadow.innerHTML = this.template
      if (handlers && handlers.connect) handlers.connect(this.shadow, this.data, this.elements)

      this.elements = Array.from(this.shadow.querySelectorAll('[data-key]')).reduce((result, node) => {
        return {
            ...result,
            [node.dataset.key]: node,
        }
      }, {})
    }

    disconnectedCallback() {
      if (handlers && handlers.disconnect) handlers.disconnect(this.shadow, this.data, this.elements)

      listeners.forEach((eventType) => {
        this.shadow.removeEventListener(eventType, this.handlerWrapper);
      });
    }

    handlerWrapper = (event) => {
      const dispatch = (type, payload) => {
        this.dispatchEvent(
          new CustomEvent(type, {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: payload,
          })
        );
      };

      const response = handlers[event.type](
        event,
        { ...this.data },
        dispatch,
        this.update
      );
      if (response && Object.getPrototypeOf(response) === Object.prototype)
        this.update(response);
    };
  }

  customElements.define(name, Component);
};
