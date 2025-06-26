import { knex } from "knex"

export const kx = knex({
    client: 'sqlite3',
    connection: {
        filename: './tmp/app.db',
    },
})