export function validateInnerAppCreation(e) {
    let validationResults = []
    let appNumber = e.target.appNumber.value;
    let location = e.target.location.value;

    (!appNumber || appNumber < 1 || appNumber > 999999999) && validationResults.push("appNumber");

    (!location) && validationResults.push("location");

    return validationResults;
}

export function validateSupplierAppCreation(e) {
    let validationResults = []
    let appNumber = e.target.appNumber.value;

    (!appNumber || appNumber < 1 || appNumber > 999999999) && validationResults.push("appNumber");

    return validationResults;
}