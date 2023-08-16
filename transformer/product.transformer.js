export function productTransformer(data) {
    const transformedData = {
        item_id: data.id,
        item_name: data.name,
        item_slug: data.slug,
        affiliation: "",
        coupon: "",
        discount: data.variants[0]?.specialPriceRec ? calculateDiscount(data.variants[0].priceRec, data.variants[0].specialPriceRec) : 0,
        index: "",
        item_brand: data.brand.name,
        item_category: data.category,
        item_category2: data.subcategory,
        item_category3: "",
        item_category4: "",
        item_category5: "",
        item_list_id: "",
        item_list_name: "",
        item_variant: "",
        location_id: "",
        price: data.variants[0].priceRec,
        quantity: data.variants[0].quantity,
    }
    return transformedData;
}

export function productShortTransformer(data) {
    const transformedData = {
        'name': data.name,
        'id': data.id,
        'price': data.variants[0].priceRec,
        'brand': data.brand.name,
        'category': data.category,
        'variant': (data?.option) ? data.option : data.variants[0].option,
        ...(data.quantity && { quantity: data.quantity })
    }
    return transformedData;
}

function calculateDiscount(price, discountPrice) {
    const res = (price - discountPrice).toFixed(2);
    return parseFloat(res);
}