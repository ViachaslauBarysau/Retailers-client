export function validateSupplierWarehouse(e) {
    let validationResults = []
    let name = e.target.name.value;
    let city = e.target.city.value;
    let firstAddressLine = e.target.address1.value;

    (name.trim().length === 0 || !name || name.length < 3 || name.length > 30) && validationResults.push("name");
    (city.trim().length === 0 || !city || city.length < 3 || city.length > 30) && validationResults.push("city");
    (firstAddressLine.trim().length === 0 || !firstAddressLine || firstAddressLine.length < 5) &&
    validationResults.push("firstAddressLine");

    return validationResults;
}
