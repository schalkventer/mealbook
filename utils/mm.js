export const html = (staticArray, ...dynamic) => {
  const stringArray = staticArray || [];
  const array = (dynamic || []).map((singleDynamic, index) => {
    return `${stringArray[index] || ""}${singleDynamic || ""}`;
  });

  const lastIndexStatic = stringArray.length - 1;
  return `${array.join("")}${stringArray[lastIndexStatic]}`;
};

/**
 * @param {string} name
 * @param {Record<string, Record<string, (elements: Record<string, HTMLElement>, dispatch: (type: string, payload: Record<string, any>) => void | Promise<void>)} handlers
 */
export const createComponent = (name, init, handlers) => {
  if (!name) throw new Error('"name" is required');

  if (!/\-/.test(name))
    throw new Error('"name" requires a hypen ("-") in the value.');

  const elementsList = Object.keys(handlers).filter(value => value !== 'root');

  const elementsEventObj = elementsList.reduce((result, elementName) => {
    return {
      ...result,
      ...handlers[elementName],
    };
  }, {});

  const eventsList = Object.keys(elementsEventObj);

  class Component extends HTMLElement {
    shadow = this.attachShadow({ mode: "closed" });
    elements = {};

    constructor() {
      super();
    }

    dispatch = (type, payload) => {
      this.dispatchEvent(
        new CustomEvent(type, {
          composed: true,
          bubbles: true,
          cancelable: true,
          detail: payload,
        })
      );
    };

    handlerWrapper = (event) => {
      const { target, type } = event;
      const { dataset = {} } = target || {};
      const { key } = dataset;
      const element = handlers[key] || {};
      const callback = element[type];

      if (!key || !callback) return;
      callback(this.elements, this.dispatch);
    }

    connectedCallback() {
      this.shadow.innerHTML = init(this);

      this.elements = elementsList.reduce((result, elementName) => {
        return {
          ...result,
          [elementName]: this.shadow.querySelector(
            `[data-key="${elementName}"]`
          ),
        };
      }, {});

      if (handlers.root && handlers.root.connect) {
        handlers.root.connect(this.elements, this.dispatch)
      }

      eventsList.forEach((eventType) => {
        this.shadow.addEventListener(eventType, this.handlerWrapper);
      });
    }

    disconnectedCallback() {
      if (handlers.root && handlers.root.disconnect) {
        handlers.root.disconnect(this.elements, this.dispatch)
      }

      eventsList.forEach((eventType) => {
        this.shadow.removeEventListener(eventType, this.handlerWrapper);
      });
    }
  }

  customElements.define(name, Component);
};
