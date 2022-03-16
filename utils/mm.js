export const html = (staticArray, ...dynamic) => {
  const stringArray = staticArray || [];
  const array = (dynamic || []).map((singleDynamic, index) => {
    return `${stringArray[index] || ""}${singleDynamic || ""}`;
  });

  const lastIndexStatic = stringArray.length - 1;
  return `${array.join("")}${stringArray[lastIndexStatic]}`;
};

export const createList = (callback) => (array) => {
  const list = array.map((item) => callback(item));
  return list.join("");
};

/**
 * @template T
 * @param {{ name: string, render: (data: T, shadow: ShadowRoot, prev: T) => string | null, data?: T | ((node: HTMLElement) => T), handlers?: Record<string, (event: Event, update: (object: Partial<T>) => void, dispatch: (type: string, payload: object) => void) => Promise<void>> }} props
 */
export const createComponent = (props) => {
  const { name, data, render, handlers = {} } = props;
  if (!name) throw new Error('"name" is required');
  if (!/\-/.test(name))
    throw new Error('"name" requires a hypen ("-") in the value.');

  const listeners = Object.keys(handlers);

  class Component extends HTMLElement {
    shadow = this.attachShadow({ mode: "closed" });
    data = typeof data === "function" ? data(this) : data || {};

    update(newData) {
      const prev = { ...this.data };
      const merged = { ...this.data, ...newData };
      const result = render(merged, prev, this);
      if (!result) return;

      this.shadow.innerHTML = `
        <style>
          * { 
            box-sizing: border-box 
          }
        </style>
        
        ${result}
      `;
    }

    connectedCallback() {
      listeners.forEach((eventType) => {
        this.shadow.addEventListener(eventType, this.handlerWrapper);
      });

      this.update({});
    }

    disconnectedCallback() {
      listeners.forEach((eventType) => {
        this.shadow.removeEventListener(eventType, this.handlerWrapper);
      });
    }

    constructor() {
      super();
    }

    handlerWrapper(event) {
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

      handlers[event.type](event, this.update, dispatch);
    }
  }

  customElements.define(name, Component);
};
