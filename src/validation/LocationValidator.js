export function validateLocationCreation(e) {
    let validationResults = []
    let identifier = e.target.identifier.value;
    let city = e.target.city.value;
    let firstAddressLine = e.target.address1.value;
    let totalCapacity = e.target.total_capacity.value;

    (identifier.trim().length === 0 || !identifier || identifier.length < 3 || identifier.length > 30) &&
    validationResults.push("identifier");
    (city.trim().length === 0 || !city || city.length < 3 || city.length > 30) && validationResults.push("city");
    (firstAddressLine.trim().length === 0 || !firstAddressLine || firstAddressLine.length < 5 ||
        firstAddressLine.length > 30) && validationResults.push("firstAddressLine");
    (totalCapacity < 1) && validationResults.push("totalCapacity");

    return validationResults;
}

export function validateLocationEditing(location) {
    let validationResults = []
    let identifier = location.identifier;
    let city = location.address.city;
    let firstAddressLine = location.address.firstAddressLine;

    (identifier.trim().length === 0 || !identifier || identifier.length < 3 || identifier.length > 30) &&
    validationResults.push("identifier");
    (city.trim().length === 0 || !city || city.length < 3 || city.length > 30) && validationResults.push("city");
    (firstAddressLine.trim().length === 0 || !firstAddressLine || firstAddressLine.length < 5 ||
        firstAddressLine.length > 30) && validationResults.push("firstAddressLine");

    return validationResults;
}
