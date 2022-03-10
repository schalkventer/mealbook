import { createComponent, html } from '../../utils/mm.js'

const calcColor = ({ importance, theme }) => {
    if ()
}

createComponent({
    name: 'button-element',

    data: ({ dataset }) => ({
        importance: dataset.importance || 'secondary'
    }),

    render: (data) => {
        const { importance } = data

        const style = html`
            <style>
                button, 
                a {
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-subtle);
                    border: 1px solid rgba(var(--color-green), var(--opacity-${importance === 'secondary' ? 'solid' : 'none'}));;
                    background: rgba(var(--color-green), var(--opacity-${importance === 'secondary' ? 'none' : 'solid'}));
                    width: 100%;
                    padding: var(--spacing-m);
                    color: rgb(var(--color-${importance === 'secondary' ? 'green' : 'white'}));
                    font: var(--font-l);
                    letter-spacing: var(--font-spacing-l);
                    text-transform: uppercase;
                    cursor: pointer;
                    box-shadow: var(--shadow-${importance === 'secondary' ? 'none' : 'medium'});
                    transform: translateY(0);
                }

                button:hover, 
                a:hover {
                    background: rgba(var(--color-green), var(--opacity-${importance === 'secondary' ? 'subtle' : 'crisp'}));
                }

                button:active, 
                a:active {
                    transform: translateY(1px);
                    box-shadow: var(--shadow-none)
                }  
            </style>
        `

        if (typeof action === 'string') {
            return html`
                ${style}
                <a href=""><slot></slot></a>
            `
        }

        return html`
            ${style}
            <button><slot></slot></button>
        `
    }
})