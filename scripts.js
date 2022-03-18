import { createComponent, html } from './utils/mm.js'

const init = () => {
    return html`<div data-key="yo">xxx</div>`
}

createComponent(
    'test-me', 
    init, 
    {
        root: {
            connect: (elements) => console.log(elements),
            disconnect: () => console.log('disconnecting'),
        },
        yo: {
            click: async ({ yo }) => yo.innerText = 'adsasd'
        }
    }
)