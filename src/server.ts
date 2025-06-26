import fastify from "fastify"

import { kx } from "./database"

const app = fastify()

app
    .get(
        '/test',
        async () => {
            const tables = await kx('sqlite_schema').select('*')
            return tables
        }
    )

app
    .listen({
        port: 3333
    })
    .then(
        () => {
            console.log('Server running!')
        }
    )