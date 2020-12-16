export function validateSupplier(e) {
    let validationResults = []
    let fullName = e.target.fullName.value;
    let identifier = e.target.identifier.value;

    (fullName.trim().length === 0 || !fullName || fullName.length < 3 || fullName.length > 40) && validationResults.push("fullName");
    (!(/\d+/.test(identifier)) || !identifier || identifier < 1 || identifier > 999999999) && validationResults.push("identifier");

    return validationResults;
}
