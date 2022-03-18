import { createComponent, html } from '../utils/mm.js'

const init = () => {
    return html`<div>123123</div>`
}

createComponent('test-me', init)