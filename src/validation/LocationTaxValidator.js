export function validateLocationTaxEditing(location) {
    let validationResults = []
    let locationTax = location.locationTax;

    (locationTax < 0) && validationResults.push("locationTax");

    return validationResults;
}