import { randomUUID } from "node:crypto"
import { FastifyInstance } from "fastify"
import { z } from "zod"

import { kx } from "../database"
import knex from "knex"


export async function transactions(app: FastifyInstance) {
    app.get(
        '/',
        async () => {
            const transactions = await kx('transactions').select()
            return { transactions }
        }
    )

    app.get(
        '/:id',
        async (request) => {
            const getTransactionSchema = z.object({
                id: z.string().uuid(),
            })
            const { id } = getTransactionSchema.parse(request.params)

            const transaction = await kx('transactions').where('id', id).first()
            return { transaction }
        }
    )

    app.get(
        '/summary',
        async () => {
            const summary = await kx('transactions').sum('amount', { as: 'amount' }).first()
            return { summary }
        }
    )

    app.post(
        '/',
        async (request, reply) => {
            const createTransactionSchema = z.object({
                title: z.string(),
                amount: z.number(),
                type: z.enum(['credit', 'debit'])
            })
            const { title, amount, type } = createTransactionSchema.parse(request.body)

            await kx('transactions').insert({
                id: randomUUID(),
                title: title,
                amount: type === 'credit' ? amount : amount * -1,
            })

            reply.code(201).send()
        }
    )
}