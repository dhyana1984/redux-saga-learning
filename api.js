export const fetch = (url) => {
    if (url = '/products') {
        const product = { productId: 1, productName: 'Cup' }
        return new Promise((resolve, reject) => {
            setTimeout(resolve(product), 20000)
        })
    }
}