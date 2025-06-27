import { afterAll, beforeAll, test, expect, describe } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'

describe('Transactions routes', () => {
    beforeAll(
        async () => {
            await app.ready()
        }
    )

    afterAll(
        async () => {
            await app.close()
        }
    )

    test('Create new transaction returns 201', async () => {
        const response = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 200,
                type: 'credit',
            })

        expect(response.status).toBe(201)
    })
})


