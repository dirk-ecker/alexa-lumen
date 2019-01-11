const jsdom = require('jsdom')
const { JSDOM } = jsdom

exports.runningSoon = runningSoon

const url = 'http://dn.das-lumen.de/kino/home/city282'

function runningSoon(callback) {
    JSDOM.fromURL(url).then(dom => {
        const document = dom.window.document
        const body = document.body
        const programNodes = document.querySelectorAll('.heute-im-programm > .section-content > .item')
        const program = [...programNodes].map(filmNode => {
            const figureNode = filmNode.firstElementChild
            const linkHtml = figureNode.innerHTML.trim()
            const contentNode = filmNode.lastElementChild
            const [movie, time] = contentNode.textContent.split('\n')
                .map(value => value.trim())
                .filter(value => value)
            return { movie, time, linkHtml }
        })

        // reduce to one entry per movie with all play times
        callback(program.reduce((result, { movie, time, linkHtml }) => {
            result[movie] = result[movie] || { linkHtml, movie, times: [] }
            result[movie].times.push(time)
            return result
        }, {}))
    })
}
