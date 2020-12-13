export function validateItems(items) {
    for (let i = 0; i < items.length; i++) {
        if (!items[i].upc || items.filter(item => item.upc === items[i].upc).length > 1) {
            items[i] = {
                ...items[i],
                upcError: true
            }
        } else {
            items[i] = {
                ...items[i],
                upcError: false
            }
        }
        if(!items[i].amount || items[i].amount < 1 || items[i].amount > items[i].max) {
            items[i] = {
                ...items[i],
                amountError: true
            }
        } else {
            items[i] = {
                ...items[i],
                amountError: false
            }
        }
    }
    return items;
}

export function validateSupplierAppItems(items) {
    for (let i = 0; i < items.length; i++) {
        if (!items[i].upc || items.filter(item => item.upc === items[i].upc).length > 1) {
            items[i] = {
                ...items[i],
                upcError: true
            }
        } else {
            items[i] = {
                ...items[i],
                upcError: false
            }
        }
        if(!items[i].amount || items[i].amount < 1) {
            items[i] = {
                ...items[i],
                amountError: true
            }
        } else {
            items[i] = {
                ...items[i],
                amountError: false
            }
        }
        if(!items[i].cost || items[i].cost < 0.01) {
            items[i] = {
                ...items[i],
                costError: true
            }
        } else {
            items[i] = {
                ...items[i],
                costError: false
            }
        }
    }
    return items;
}