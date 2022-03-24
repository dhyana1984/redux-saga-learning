import test from 'tape';

import { put, call } from 'redux-saga/effects'
import { incrementAsync, delay } from './sagas'

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
});
