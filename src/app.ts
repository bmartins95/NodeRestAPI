import fastify from "fastify"

import { transactions } from "./routes/transactions"

export const app = fastify()
app.register(transactions, { prefix: 'transactions' })