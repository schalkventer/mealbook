
/**
 * @param {string} name
 * @param {Record<string, Record<string, (elements: Record<string, HTMLElement>, dispatch: (type: string, payload: Record<string, any>) => void)} handlers
 */
export const createComponent = (name, init, handlers) => {
    if (!name) throw new Error('"name" is required');
  
    if (!/\-/.test(name))
      throw new Error('"name" requires a hypen ("-") in the value.');
  
    const elementsList = Object.keys(handlers);

    const elementsEventObj = elementsList.reduce((result, elementName) => {
        const eventObj = Object.keys(handlers[elementName])

        return {
            result,
            ...eventObj
        }
    }, {})
    

    const eventsList = Object.keys(elementsEventObj);

    class Component extends HTMLElement {
        shadow = this.attachShadow({ mode: "closed" });
        elements = {}

        constructor() {
            super()
        }

        handlerWrapper (event) {
            const { target, type } = event 
            const { dataset = {} } = target || {}
            const { key } = dataset
            const element = handlers[key] || {}
            const callback = element || {}

            if (!key || !callback) return

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

            callback(this.elements, dispatch)
        }

        connectedCallback() {
            this.shadow.innerHTML = init(this)

            this.elements = elementsList.reduce((result, elementName) => {
                return {
                    ...result,
                    [elementName]: document.querySelector('[data-key]'),
                }
            }, {})

            eventsList.forEach((eventType) => {
                this.shadow.removeEventListener(eventType, this.handlerWrapper);
              });
        }

          
      disconnectedCallback() {
        if (handlers && handlers.disconnect) handlers.disconnect(this.shadow, this.data, this.elements)
  
        eventsList.forEach((eventType) => {
          this.shadow.removeEventListener(eventType, this.handlerWrapper);
        });
      }
    }

    customElements.define(name, Component);
}