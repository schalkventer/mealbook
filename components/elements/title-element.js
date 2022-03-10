import { createComponent, html } from '../../utils/mm.js'

const SIZE_MAP = {
    s: 'l',
    m: 'xl',
    l: 'xxl',
}

createComponent({
    name: 'title-element',


    data: (node) => {
        console.log(node)
        const { dataset } = node
        if (!dataset.level) throw new Error('"data-level" is required')
        const level = parseInt(dataset.level)

        const isValidLevel = level >= 1 && level <= 6
        if (!isValidLevel) throw new Error('"data-level" is required to be between 1 and 6')

        const size = dataset.size || 'm'
        if (!['s', 'm', 'l'].includes(size)) throw new Error('"data-size" is required to be "s", "m" or "l"')

        return {
            level,
            size,
        }
    },

    render: ({ level, size }) => {
        const tag = `h${level}`

        return html`
            <style>
                .wrapper {
                    font-size: var(--size-${SIZE_MAP[size]})
                }
            </style>
            <${tag} class="wrapper"><slot></slot></${tag}>
        `
    }
})