// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

async function main() {
    await app.prepare()
    const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT, 10) || parseInt(process.env.PORT, 10) || 3000
    createServer((req, res) => {
        let parsedUrl = parse(req.url, true)
        if (parsedUrl.pathname.startsWith('/api/server_function') && req.headers["x-ms-original-url"]) {
            parsedUrl = parse(req.headers["x-ms-original-url"], true)
        }
        handle(req, res, parsedUrl)
    }).listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
}

main()