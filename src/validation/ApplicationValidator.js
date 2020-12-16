export function validateInnerAppCreation(e) {
    let validationResults = []
    let appNumber = e.target.appNumber.value;
    let location = e.target.location.value;

    (!(/\d+/.test(appNumber)) || !appNumber || appNumber < 1 || appNumber > 999999999) && validationResults.push("appNumber");

    (!location) && validationResults.push("location");

    return validationResults;
}

export function validateSupplierAppCreation(e) {
    let validationResults = []
    let appNumber = e.target.appNumber.value;
    let supplierWarehouse = e.target.supplierWarehouse.value;
    (!(/\d+/.test(appNumber)) || !appNumber || appNumber < 1 || appNumber > 999999999) && validationResults.push("appNumber");
    (!supplierWarehouse) && validationResults.push("supplierWarehouse");

    return validationResults;
}