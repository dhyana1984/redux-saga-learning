export function* helloSaga() {
    console.log('Hello Sagas!')
}

import { put, takeEvery, all } from 'redux-saga/effects'

/*
 * We create a delay function that returns a Promise that will resolve after a specified number of milliseconds. 
 */
const delay = (ms) => new Promise(res => setTimeout(res, ms))

/*
 * Worker Saga: will perform the async increment task 
 * the incrementAsync Saga sleeps for 1 second via the call to delay(1000), then dispatches an INCREMENT action.
 */
export function* incrementAsync() {
    /*
     * We'll use this function to block the Generator.  
     * Sagas are implemented as Generator functions that yield objects to the redux-saga middleware. 
     * The middleware will suspend the Saga until the Promise completes
     */
    yield delay(1000)

    /*
     * "put" instructs the middleware to dispatch an INCREMENT action.
     * "put" is one example of what we call an Effect
     * When a middleware retrieves an Effect yielded by a Saga, the Saga is paused until the Effect is fulfilled
     */
    yield put({ type: 'INCREMENT' })
}

/*
 * Watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
 */
export function* watchIncrementAsync() {
    /*
     * "takeEvery" to listen for dispatched INCREMENT_ASYNC actions and run incrementAsync each time.
     */
    yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

/*
 * Need to start them both at once 
 * Add a rootSaga that is responsible for starting our Sagas
 * This means the two resulting Generators will be started in parallel as in a array
 */
export default function* rootSaga() {
    yield all([
        helloSaga(),
        watchIncrementAsync()
    ])
}