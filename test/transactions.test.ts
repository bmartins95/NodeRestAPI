import { afterAll, beforeAll, test, expect, describe, beforeEach } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'
import { execSync } from 'node:child_process'

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

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

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

    test('List transactions should return 200 and match values', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 200,
                type: 'credit',
            })

        const listResponse = await request(app.server).get('/transactions').expect(200)
        expect(listResponse.body.transactions).toContainEqual(
            {
                title: 'New transaction',
                amount: 200,
                created_at: expect.any(String),
                id: expect.any(String),
                session_id: null,
            },
        )
    })

    test('Get transaction should return 200 and match values', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 200,
                type: 'credit',
            })

        const listResponse = await request(app.server).get('/transactions')
        const transactionId = listResponse.body.transactions[0].id
        const getTransactionResponse = await request(app.server).get(`/transactions/${transactionId}`)
        expect(getTransactionResponse.body.transaction).toEqual(
            {
                title: 'New transaction',
                amount: 200,
                created_at: expect.any(String),
                id: expect.any(String),
                session_id: null,
            },
        )
    })

    test('Get transaction summary should return 200 and match sum', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 600,
                type: 'credit',
            })

        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 200,
                type: 'debit',
            })

        const summaryResponse = await request(app.server).get('/transactions/summary')
        expect(summaryResponse.body.summary.amount).toEqual(400)
    })
})


