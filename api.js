

export const fetchProducts = (url) => {
    if (url = '/products') {
        const product = { productId: 1, productName: 'Cup' }
        return new Promise((resolve, reject) => {
            setTimeout(resolve(product), 20000)
        })
    }
}

export const fetchDE43 = async () => await fetch('https://qqlykm.cn/api/yan/yd.php?city=2019-6-18')