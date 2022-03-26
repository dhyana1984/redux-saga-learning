
import { channel } from 'redux-saga'
import { put, takeEvery, all, call, takeLatest, fork, apply, take } from 'redux-saga/effects'
import * as Api from './api'

export function* helloSaga() {
  console.log('Hello Sagas!')
}

/*
 * We create a delay function that returns a Promise that will resolve after a specified number of milliseconds. 
 */
export const delay = (ms) => new Promise(res => setTimeout(res, ms))

/*
 * Worker Saga: will perform the async increment task 
 * the incrementAsync Saga sleeps for 1 second via the call to delay(1000), then dispatches an INCREMENT action.
 */
export function* incrementAsync() {
  /*
   * We'll use this function to block the Generator.  
   * Sagas are implemented as Generator functions that yield objects to the redux-saga middleware. 
   * The middleware will suspend the Saga until the Promise completes
   * The yield expression delay(1000) is evaluated before it gets passed to the caller of next 
   * (the caller could be the middleware when running our code. 
   * It could also be our test code which runs the Generator function and iterates over the returned Generator). 
   * So what the caller gets is a Promise
   */
  // yield delay(1000)

  /*
   * The yield expression call(delay, 1000) is what gets passed to the caller of next. 
   * call just like put, returns an Effect which instructs the middleware to call a given function with the given arguments. 
   * In fact, neither put nor call performs any dispatch or asynchronous call by themselves, 
   * they return plain JavaScript objects
   * What happens is that the middleware examines the type of each yielded Effect then decides how to fulfill that Effect. 
   * If the Effect type is a PUT then it will dispatch an action to the Store. 
   * If the Effect is a CALL then it'll call the given function
   */
  yield call(delay, 1000)

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

function* watchFetchProducts() {
  /*
   * takeEvery allows multiple fetchData instances to be started concurrently
   */
  // yield takeEvery('PRODUCTS_REQUESTED', fetchProducts)

  /*
   * If we want to only get the response of the latest request fired (e.g. to always display the latest version of data) we can use the takeLatest
   * takeLatest allows only one fetchData task to run at any moment
   */
  yield takeLatest('PRODUCTS_REQUESTED', fetchProducts)

}

export function* fetchProducts() {
  try {
    const products = yield call(Api.fetchProducts, '/products')
    yield put({ type: 'PRODUCTS_REQUESTED_REAL', products })
  } catch (error) {
    yield put({ type: 'PRODUCTS_REQUESTED_FAILED', error })
  }
}

/*
 *  CHANNEL_TEST action listener
 */
function* watchRequests() {
  const chan = yield call(channel)

  /*
   * Launch 3 worker task at the same time to handle maxmum 3 task at the same time 
   */
  for (let i = 0; i < 3; i++) {
    yield fork(channelHanlder, chan)
  }

  /*
   * Keep listening CHANNEL_TEST action  
   */
  while (true) {
    const { payload } = yield take('CHANNEL_TEST')
    /*
     * Dispatch payload to Channel to trigger Channel handler
     */
    yield put(chan, payload)
  }
}

/* 
 * Channel listener. This handler will be triggered when put payload to this channel
 */
function* channelHanlder(chan) {
  // Need to run all the time in while (true)
  while (true) {
    const payload = yield take(chan)
    const result = yield call(Api.fetchDE43)
    const text = yield result.text()
    yield apply(console, console.log, [{ response: text, payload }])
  }
}

/*
 * Need to start them both at once 
 * Add a rootSaga that is responsible for starting our Sagas
 * This means the two resulting Generators will be started in parallel as in a array
 */
export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync(),
    watchFetchProducts(),
    watchRequests()
  ])
}