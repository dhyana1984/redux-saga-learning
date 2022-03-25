import { takeEvery } from "redux-saga/effects";
import * as Api from './api'

function* watchFetchProducts(params) {
    yield takeEvery('PRODUCTS_REQUESTED', fetchProducts)
}

function* fetchProducts() {
    const products = yield Api.fetch('/products')
    console.log(products)
}