import { productShortTransformer, productTransformer } from "../transformer/product.transformer";
export function viewItemForSeo(details, id) {
    const transformedData = productShortTransformer(details);
    const payLoad = {
        event: "view_item",
        ecommerce: {
            detail: {
                currencyCode: "USD",
                products: [transformedData],
            }
        }
    }
    dataLayer.push({ ecommerce: null });
    dataLayer.push(payLoad);
}

export function addToCartItemForSeo(data, quantity) {
    const transformedData = productShortTransformer({ ...data, quantity: quantity });
    let payLoad = {
        event: "add_to_cart",
        ecommerce: {
            currencyCode: "USD",
            add: {
                products: [transformedData]
            }
        }
    }
    dataLayer.push({ ecommerce: null });
    dataLayer.push(payLoad);
}

export function increaseAddToCartItemForSeo(data, quantity) {
    const transformedData = productShortTransformer({ ...data, quantity: quantity });
    let payLoad = {
        event: "add_to_cart",
        ecommerce: {
            currencyCode: "USD",
            add: {
                products: [transformedData]
            }
        }
    }
    dataLayer.push({ ecommerce: null });
    dataLayer.push(payLoad);
}

export function decreaseAddToCartItemForSeo(data, quantity) {
    const transformedData = productShortTransformer({ ...data, quantity: quantity });
    let payLoad = {
        event: "remove_from_cart",
        ecommerce: {
            currencyCode: "USD",
            remove: {
                products: [transformedData]
            }

        }
    }
    dataLayer.push({ ecommerce: null });
    dataLayer.push(payLoad);
}

export function removeFromCartItemsForSeo(data, quantity) {
    const transformedData = productShortTransformer({ ...data, quantity: quantity });
    let payLoad = {
        event: "remove_from_cart",
        ecommerce: {
            currencyCode: "USD",
            remove: {
                products: [transformedData]
            }

        }
    }
    dataLayer.push({ ecommerce: null });
    dataLayer.push(payLoad);
}

export function checkoutItemsForSeo(dataList) {
    const tempList = dataList.map(data => {
        return productShortTransformer(data);
    })
    let payLoad = {
        event: "begin_checkout",
        ecommerce: {
            currencyCode: "USD",
            checkout: {
                products: [...tempList]
            },
        }
    }
    dataLayer.push({ ecommerce: null });
    dataLayer.push(payLoad);
}


export function purchaseForSeo(order) {
    let tempArr = [];
    order.items.forEach(element => {
        let payLoad = {
            ...element.product,
            quantity: element.quantity,
            variant: element.option,
        }
        const transformedData = productShortTransformer(payLoad);
        tempArr.push(transformedData);
    })
    let payLoad = {
        event: "purchase",
        ecommerce: {
            purchase: {
                actionField: {
                    id: order.id,
                    currencyCode: "USD",
                    revenue: order.total,
                    tax: order.tax,
                    shipping: "",
                    coupon: "",
                },
                products: [...tempArr]
            }
        }
    }
    dataLayer.push({ ecommerce: null });
    dataLayer.push(payLoad);
    // const indexNo = findIndexByKeyValue('event', 'purchase');
    // window.dataLayer[indexNo] = payLoad;
    // localStorage.setItem('purchase', JSON.stringify(payLoad));

}


function findIndexByKeyValue(key, value) {
    return window.dataLayer.findIndex(function (item) {
        return item.hasOwnProperty(key) && item[key] === value;
    });
}