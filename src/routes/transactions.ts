import { FastifyInstance } from "fastify"
import { z } from "zod"
import { randomUUID } from "node:crypto"

import { kx } from "../database"


export async function transactions(app: FastifyInstance) {
    app.get(
        '/',
        async () => {
            return await kx('transactions').select('*')
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