import test from 'tape';
import * as Api from './api'
import { put, call } from 'redux-saga/effects'
import { incrementAsync, delay, fetchProducts } from './sagas'

test('incrementAsync Saga test', (assert) => {
    const generator = incrementAsync()
    assert.deepEqual(
        generator.next().value,
        call(delay, 1000),
        'counter Saga must call delay(1000)'
    )

    assert.deepEqual(
        generator.next().value,
        put({ type: 'INCREMENT' }),
        'counter Saga must dispatch an INCREMENT action'
    )

    assert.deepEqual(
        generator.next(),
        { done: true, value: undefined },
        'counter Saga must be done'
    )

    assert.end()
})

test('fetchProducts Saga test', (assert) => {
    const generator = fetchProducts()

    assert.deepEqual(
        generator.next().value,
        call(Api.fetch, '/products'),
        'fetchProducts should yield an Effect call(Api.fetch, "/products")'
    )

    // create a fake response
    const products = undefined
    assert.deepEqual(
        generator.next().value,
        put({ type: 'PRODUCTS_REQUESTED_REAL', products }),
        "fetchProducts should yield an Effect put({ type: 'PRODUCTS_RECEIVED', products })"
    )

    assert.end()
});


test('fetchProducts Saga test with error', (assert) => {
    const generator = fetchProducts()

    assert.deepEqual(
        generator.next().value,
        call(Api.fetch, '/products'),
        'fetchProducts should yield an Effect call(Api.fetch, "/products")'
    )

    //Test error
    const error = {}
    assert.deepEqual(
        generator.throw(error).value,
        put({ type: 'PRODUCTS_REQUESTED_FAILED', error }),
        "fetchProducts should yield an Effect put({ type: 'PRODUCTS_REQUEST_FAILED', error })"
    )

    assert.end()
});

