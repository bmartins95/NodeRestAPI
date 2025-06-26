import fastify from "fastify"

import { kx } from "./database"
import { env } from "./env"

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
        port: env.PORT
    })
    .then(
        () => {
            console.log('Server running!')
        }
    )